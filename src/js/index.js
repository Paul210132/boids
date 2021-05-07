import mapPanelControls from './graphical/settingsPanelUI.js';
import generateRandomBG from './graphical/painter.js';
import _settings from './settings.js';
import _scene from './entities/scene.js';

let settings = new _settings({});
let boids = [];
let scene = new _scene(settings);
let cont = document.getElementById("container");
cont.style.width = innerWidth;
cont.style.height = innerHeight;
updateSettingsFromInput();
generateRandomBG(settings.night);
mapPanelControls();
let componentMap = [
  {id:"canvas",event:"click",f:clickBackground},
  {id:"clickToAddBoid",event:"click",f:clickToAddBoid},
  {id:"clear",event:"click",f:clear},
  {id:"togglePlay",event:"click",f:togglePlay},
  {id:"toggleNight",event:"click",f:toggleNight},
  {id:"edgeWidth",event:"change",f:updateSettingsFromInput},
  {id:"speedModifier",event:"change",f:updateSettingsFromInput},
  {id:"boidSize",event:"change",f:updateSettingsFromInput},
  {id:"switchMode",event:"change",f:updateSettingsFromInput},
  {id:"oscillation",event:"change",f:updateSettingsFromInput}
];
componentMap.forEach((item) => {
  const comp = document.getElementById(item.id);
  comp.addEventListener(item.event,item.f);
});

function toggleNight() {
  settings.toggleNight();
  let btn = document.getElementById("toggleNight");
  btn.innerHTML = settings.night ? "🌝":"🌚";
  generateRandomBG(settings.night);
}
function updateSettingsFromInput() {
  settings.setSpeedModifier(document.getElementById("speedModifier").value);
  settings.setEdgeWidth(document.getElementById("edgeWidth").value);
  settings.setBoidSize(document.getElementById("boidSize").value);
  settings.setMode(document.getElementById("switchMode").value);
  settings.setOscillation(document.getElementById("oscillation").checked);
}
function clickBackground(ev) {
  for(let boid of scene.boids){
    if(boid.shape.distanceToPoint(ev.clientX,ev.clientY)<30){
      boid.selectBoid();
    }
  }
}
function clickToAddBoid() {
  for(let i = 0; i<parseInt(document.getElementById("addQty").value); i++){
    scene.addBoid();    
  }
}
function clear() {
  scene.boids=[];
}

// Time Management
let timeLoop = setInterval(timer, settings.interval);
function timer() { //TODO: migrate https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
  if(settings.play){
    scene.render();
  }
}
function togglePlay() {
  settings.togglePlay();
  let btn = document.getElementById("togglePlay");
  btn.innerHTML = settings.play ? "⏸️": "▶️";
}
function stop() {
  settings.play = false;
  clearInterval(timeLoop);
}
