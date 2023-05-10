import { Component } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'manufacturing-program';
  userData$!: Observable<any>;
  effect!: number;
  voltage!: number;
  pipeLength!: number;
  utdragResultat!: number;
  okResultat: Array<number> = [];
  sortedList: Array<number> = [];

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

  addOrder() {
    const resistance = Math.pow(this.voltage,2) / (this.effect);
    for (let index = 0; index < this.dornArray.length; index++) {
      this.wireArray.forEach(wirediameter => {
        const lapLength = (wirediameter.diameter + this.dornArray[index]) * Math.PI;
        const lWire = resistance / wirediameter.ohm;
        const numberOfLaps = (lWire * 1000) / lapLength;
        const lTät = (wirediameter.diameter) * numberOfLaps;
        this.utdragResultat =  (this.pipeLength / lTät);
        if(this.utdragResultat > 2.9 && this.utdragResultat < 3.2){
          this.okResultat.push(this.utdragResultat);
          return;
        }
      });
    }
    //(a,b) => b-a) sorterar för att visa de från 3.0 högst upp och minsta längst ner
    this.sortedList = this.okResultat.sort((a,b) => Math.abs(a-3)-Math.abs(b-3)); /* visar den som är närmast 3.0 */
    console.log(this.sortedList);
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