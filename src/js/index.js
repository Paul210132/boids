import mapPanelControls from './settingsPanelUI.js';
import generateRandomBG from './painter.js';
import boid from './boid.js';
import _settings from './settings.js';
import _scene from './scene.js';

let settings = new _settings();
let boids = [];
let scene = new _scene(settings);
let cont = document.getElementById("container");
cont.style.width = innerWidth;
cont.style.height = innerHeight;
updateSettingsFromInput();
generateRandomBG(settings.night);
mapPanelControls();
let componentMap = [
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
  scene.update();
}

function clickToAddBoid() {
  scene.addBoid(t);
}
function clear() {
  scene.boids=[];
  scene.update();
}

// Time Management
let t = 0;
let timeLoop = setInterval(timer, settings.interval);
function timer() { //TODO: migrate https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
  if(settings.play){
    t++;
    scene.render(t);
    //boids.map(boid => boid.renderBoid(settings, boids, t));
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
