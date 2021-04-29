export default class settings {
  constructor(edgeWidth, speedModifier, boidSize, mode, play, night, interval){
    this.edgeWidth = edgeWidth ? edgeWidth : 10;
    this.speedModifier = speedModifier ? speedModifier : .050;
    this.boidSize = boidSize ? boidSize : 10;
    this.mode = mode ? mode : "random";
    this.play = play ? play : true;
    this.night = night ? night : false;
    this.interval  = interval ? interval : 100;
  }
  updateSettingsFromInput() {
    this.setSpeedModifier(document.getElementById("speedModifier").value);
    this.setEdgeWidth(document.getElementById("edgeWidth").value);
    this.setBoidSize(document.getElementById("boidSize").value);
    this.setMode(document.getElementById("switchMode").value);
  }
  setSpeedModifier(speedModifier) {
      this.speedModifier = speedModifier || this.speedModifier;
  }
  setEdgeWidth(edgeWidth) {
      this.edgeWidth = edgeWidth || this.edgeWidth;
  }
  setBoidSize(boidSize) {
      this.boidSize = boidSize || this.boidSize;
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
}
