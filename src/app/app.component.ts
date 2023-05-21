import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ResultData } from './classes/result-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'manufacturing-program';
  countForm = new FormGroup({
    effect: new FormControl(),
    voltage: new FormControl(),
    heatedLength: new FormControl(),
  });

  userData$!: Observable<any>;
  p!: number;
  v!: number;
  heatedLength!: number;
  numberOfLaps!: number;
  u!: number;
  okResults: Array<ResultData> = [];
  sortedList: Array<ResultData> = [];
  deltaConnection: boolean = false;
  showText: boolean = false;

  wireArray = [
    { diameter: 0.2, ohm: 42.97 },
    { diameter: 0.26, ohm: 25.43 },
    { diameter: 0.265, ohm: 24.48 },
    { diameter: 0.3, ohm: 19.1 },
    { diameter: 0.335, ohm: 15.32 },
    { diameter: 0.375, ohm: 12.23 },
    { diameter: 0.42, ohm: 9.74 },
    { diameter: 0.475, ohm: 7.62 },
    { diameter: 0.5, ohm: 6.87 },
    { diameter: 0.55, ohm: 5.68 },
    { diameter: 0.6, ohm: 4.77 },
    { diameter: 0.63, ohm: 4.33 },
    { diameter: 0.65, ohm: 4.07 },
    { diameter: 0.7, ohm: 3.51 },
    { diameter: 0.75, ohm: 3.06 },
    { diameter: 0.8, ohm: 2.69 },
    { diameter: 0.85, ohm: 2.38 },
    { diameter: 0.9, ohm: 2.12 },
    { diameter: 0.95, ohm: 1.9 },
  ];

  dornArray: number[] = [
    1.7, 2.0, 2.5, 2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 5.0, 6.0, 6.5, 7.0,
  ];

  addOrder() {
    this.okResults = [];
    this.p = this.countForm.value.effect;
    this.v = this.countForm.value.voltage;
    this.heatedLength = this.countForm.value.heatedLength;
    const lK = this.heatedLength * 2 - 120;
    const rLind = Math.pow(this.v, 2) / this.p;
    const r20 = rLind / 1.03;

    for (let index = 0; index < this.dornArray.length; index++) {
      this.wireArray.forEach((wire) => {
        const o = (wire.diameter + this.dornArray[index]) * Math.PI;
        const lWire = r20 / wire.ohm;
        this.numberOfLaps = (lWire * 1000) / o;
        const lTät = wire.diameter * this.numberOfLaps;
        this.u = lK / lTät;
        const surfacePressure = this.p / 10 / wire.diameter / Math.PI / lWire;
        const surfacePressureCartridge = this.p / ((lK / 10) * 3.77);

        if (this.u > 2.9 && this.u < 3.3 && surfacePressure < 15) {
          const upperLimit = r20 * (1 + 0.015);
          const lowerLimit = r20 * (1 - 0.015);
          const roundedNumberOfLaps = Math.round(this.numberOfLaps / 2);
          const okObjects = new ResultData(
            Math.round(r20 * 100) / 100,
            roundedNumberOfLaps,
            wire.diameter,
            this.dornArray[index],
            Math.round(this.u * 100) / 100,
            Math.round(surfacePressure * 100) / 100,
            lK / 2,
            Math.round(surfacePressureCartridge * 100) / 100,
            Math.round(upperLimit * 10) / 10,
            Math.round(lowerLimit * 10) / 10
          );

          this.okResults.push(okObjects);
          this.showText = true;
          return;
        }
      });
    }
    switch (this.v) {
      case 230:
        this.deltaConnection = false;
        break;
      case 400:
        this.deltaConnection = true;
        break;
    }
    this.sortedList = this.okResults.sort(
      (a, b) => a.surfacePressure - b.surfacePressure
    );
  }
}
