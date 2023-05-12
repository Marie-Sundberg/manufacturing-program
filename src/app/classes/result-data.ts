export class ResultData {
    wireDiameter: number;
    dornDiameter: number;
    numberOfLaps: number;
    resistance: number;
    u: number;
    surfacePressure: number;
    pipeLength: number;
    surfacePressureCartridge: number;


    constructor(resistance: number, numberOfLaps: number, wireDiameter: number, dornDiameter: number, u:number, surfacePressure:number, pipeLength:number, surfacePressureCartridge:number) {
        this.resistance = resistance;
        this.numberOfLaps = numberOfLaps;
        this.wireDiameter = wireDiameter;
        this.dornDiameter = dornDiameter;
        this.u = u;
        this.surfacePressure = surfacePressure;
        this.pipeLength = pipeLength;
        this.surfacePressureCartridge = surfacePressureCartridge;
      }
}
