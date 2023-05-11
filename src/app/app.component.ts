import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, empty } from 'rxjs';
import { ResultData } from './classes/result-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'manufacturing-program';
  countForm = new FormGroup({
    effect: new FormControl(),
    voltage: new FormControl(),
    heatedLength: new FormControl()
   });

  userData$!: Observable<any>;
  effect!: number;
  voltage!: number;
  heatedLength!: number;
  numberOfLaps!: number;
  utdragResultat!: number;
  okResultat: Array<ResultData> = [];
  sortedList: Array<ResultData> = [];

  wireArray = [
    {diameter: 0.200, ohm: 42.97},
    {diameter: 0.260, ohm: 25.43},
    {diameter: 0.265, ohm: 24.48},
    {diameter: 0.300, ohm: 19.1},
    {diameter: 0.335, ohm: 15.32},
    {diameter: 0.375, ohm: 12.23},
    {diameter: 0.420, ohm: 9.74},
    {diameter: 0.475, ohm: 7.62},
    {diameter: 0.500, ohm: 6.87},
    {diameter: 0.550, ohm: 5.68},
    {diameter: 0.600, ohm: 4.77},
    {diameter: 0.630, ohm: 4.33},
    {diameter: 0.650, ohm: 4.07},
    {diameter: 0.700, ohm: 3.51},
    {diameter: 0.750, ohm: 3.06},
    {diameter: 0.800, ohm: 2.69},
    {diameter: 0.850, ohm: 2.38},
    {diameter: 0.900, ohm: 2.12},
    {diameter: 0.950, ohm: 1.9}
  ]

  dornArray: number[] = [1.7, 2.0, 2.5, 2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 5.0, 6.0, 6.5, 7.0];
 
  constructor(private firestore: Firestore) {
    this.getData();
  }

  ngOnInit(): void {
    this.countForm.controls.effect.setValue(this.effect);
    this.countForm.controls.voltage.setValue(this.voltage);
    this.countForm.controls.heatedLength.setValue(this.heatedLength);
  }

  addOrder() {
    this.effect = this.countForm.controls.effect.value;
    this.voltage = this.countForm.controls.voltage.value;
    this.heatedLength = this.countForm.controls.heatedLength.value;
    //det jag har nu funkar på samma sätt som detta nedanför, går inte att skriva flera gånger
    //this.effect = this.countForm.value.effect;
    // this.voltage = this.countForm.value.voltage;
    // this.heatedLength = this.countForm.value.heatedLength;
    console.log("effect ", this.effect);
    console.log("voltage ", this.voltage);
    console.log("heatedLength ", this.heatedLength);

    const pipeLength = (this.heatedLength *2) -120;
    const resistance = Math.pow(this.voltage,2) / (this.effect);

    for (let index = 0; index < this.dornArray.length; index++) {
      this.wireArray.forEach(wire => {
        const lapLength = (wire.diameter + this.dornArray[index]) * Math.PI;
        const lWire = resistance / wire.ohm;
        this.numberOfLaps = (lWire * 1000) / lapLength;
        const lTät = (wire.diameter) * this.numberOfLaps;
        this.utdragResultat =  (pipeLength / lTät);

        if(this.utdragResultat > 2.9 && this.utdragResultat < 3.2){
        const surfacePressure = this.effect / 10 / wire.diameter / Math.PI / lWire;
          const rounded = Math.round(this.numberOfLaps /2);
          const okObjects = new ResultData(Math.round(resistance * 100)/100, rounded, wire.diameter, this.dornArray[index], this.utdragResultat, surfacePressure, pipeLength/2);
          this.okResultat.push(okObjects);
          return;
        }
      });
    }
    //this.sortedList = this.okResultat.sort((a,b) => Math.abs(a-3)-Math.abs(b-3)); /* visar den som är närmast 3.0 */
    this.sortedList = this.okResultat.sort((a, b) => a.surfacePressure - b.surfacePressure);
  }

  addData(form:any) {
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, form.value).then(() => {
      console.log('Data Saved Successfully');
    }).catch((error) => {
      console.log(error);
    })
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'users');
    collectionData(collectionInstance, { idField: 'id'}).subscribe(val => {
      //console.log(val);
    })

    this.userData$ = collectionData(collectionInstance, { idField: 'id'});
  }

  updateData(id: string) {
    const docInstance = doc(this.firestore, 'users', id);
    // ändra detta till ett form som man fyller i sen så det blir rätt.
    const updateData = {
      name: 'updatedName'
    }
    updateDoc(docInstance, updateData)
    .then(() => {
      console.log('Data Updated');
    })
    .catch((error) => {
      console.log(error);
    })
  }

  deleteData(id:string) {
    const docInstance = doc(this.firestore, 'users', id);
    deleteDoc(docInstance).then(() => {
      console.log('Data Deleted');
    })
  }
}