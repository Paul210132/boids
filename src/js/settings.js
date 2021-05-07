export default class settings {
  constructor(params){
    this.edgeWidth = params.edgeWidth ? params.edgeWidth : 10;
    this.speedModifier = params.speedModifier ? params.speedModifier : .050;
    this.boidSize = params.boidSize ? params.boidSize : 10;
    this.mode = params.mode ? params.mode : "random";
    this.play = params.play ? params.play : true;
    this.night = params.night ? params.night : false;
    this.interval  = params.interval ? params.interval : 50;
    this.oscillation  = params.oscillation ? params.oscillation : false;
    this.currentId = 1;
  }
  setSpeedModifier(speedModifier) {
      this.speedModifier = parseFloat(speedModifier) || this.speedModifier;
  }
  setEdgeWidth(edgeWidth) {
      this.edgeWidth = parseFloat(edgeWidth) || this.edgeWidth;
  }
  setBoidSize(boidSize) {
      this.boidSize = parseFloat(boidSize) || this.boidSize;
  }
  setMode(mode) {
      this.mode = mode || this.mode;;
  }
  setOscillation(oscillation) {
      this.oscillation = oscillation;
  }
  togglePlay(){
      this.play = !this.play;
  }
  toggleNight(){
      this.night = !this.night;
  }
  generateId(){
    return this.currentId++;
  }
}
