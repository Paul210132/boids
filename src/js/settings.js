export default class settings {
  constructor(edgeWidth, speedModifier, boidSize, mode, play, night, interval, canvas){
    this.edgeWidth = edgeWidth ? edgeWidth : 10;
    this.speedModifier = speedModifier ? speedModifier : .050;
    this.boidSize = boidSize ? boidSize : 10;
    this.mode = mode ? mode : "random";
    this.play = play ? play : true;
    this.night = night ? night : false;
    this.interval  = interval ? interval : 100;
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
