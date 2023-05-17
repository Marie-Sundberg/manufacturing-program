export class ResultData {
    wireDiameter: number;
    dornDiameter: number;
    numberOfLaps: number;
    rLind: number;
    u: number;
    surfacePressure: number;
    lK: number;
    surfacePressureCartridge: number;
    upperLimit: number;
    lowerLimit: number;

    constructor(rLind: number, numberOfLaps: number, wireDiameter: number, dornDiameter: number,
      u:number, surfacePressure:number, lK:number, surfacePressureCartridge:number, upperLimit: number, lowerLimit: number) {
        this.rLind = rLind;
        this.numberOfLaps = numberOfLaps;
        this.wireDiameter = wireDiameter;
        this.dornDiameter = dornDiameter;
        this.u = u;
        this.surfacePressure = surfacePressure;
        this.lK = lK;
        this.surfacePressureCartridge = surfacePressureCartridge;
        this.upperLimit = upperLimit;
        this.lowerLimit = lowerLimit;
      }
}
