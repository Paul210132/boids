import boid from './boid.js';
import generateRandomBG from './painter.js';
import _settings from './settings.js';

let settings = new _settings();
let boids = [];
let cont = document.getElementById("container");
cont.style.width = innerWidth;
cont.style.height = innerHeight;
generateRandomBG(settings.night);
let componentMap = [
  {id:"clickToAddBoid",event:"click",f:clickToAddBoid},
  {id:"clearBoids",event:"click",f:clearBoids},
  {id:"togglePlay",event:"click",f:togglePlay},
  {id:"toggleNight",event:"click",f:toggleNight},
  {id:"dragme",event:"mousedown",f:grabPanel},
  {id:"dragme",event:"mouseenter",f:hoverPanel},
  {id:"dragme",event:"mouseleave",f:dropPanel},
  {id:"edgeWidth",event:"focusout",f:updateSettingsFromInput},
  {id:"speedModifier",event:"focusout",f:updateSettingsFromInput},
  {id:"boidSize",event:"focusout",f:updateSettingsFromInput},
  {id:"switchMode",event:"focusout",f:updateSettingsFromInput},
];
componentMap.forEach((item) => {
  const btn = document.getElementById(item.id);
  btn.addEventListener(item.event,item.f);
});
function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
}
function drag_over(event) {
    event.preventDefault();
    return false;
}
function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('dragme');
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}
var dm = document.getElementById('dragme');
dm.addEventListener('dragstart',drag_start,false);
document.body.addEventListener('dragover',drag_over,false);
document.body.addEventListener('drop',drop,false);
function grabPanel() {
  setCursor("grabbing");
} function hoverPanel() {
  setCursor("grab");
} function dropPanel() {
  setCursor("default");
} function setCursor(cursor) {
  document.body.style.cursor = cursor;
}

function updateSettingsFromInput() {
  settings.updateSettingsFromInput();
}

function addBoid(x,y,vx,vy,color,size) {
  let b = new boid(x,y,vx,vy,color,size,t);
  b.renderBoid(settings, boids, t);
//  b.setMotion();
  boids.push(b);
}
function clearBoids() {
  boids=[];
  let elts = document.getElementsByClassName('boid');
  while (elts[0]) {
      document.body.removeChild(elts[0]);
  }
}
function logBoidSpeed(){
  let maxSpeed = [0,0];
  let result = "";
  boids.forEach((boid) => {
    if(Math.abs(boid.vx) > maxSpeed[0]) { maxSpeed[0] = Math.abs(boid.vx);}
    if(Math.abs(boid.vy) > maxSpeed[1]) { maxSpeed[1] = Math.abs(boid.vy);}
  });
  result="Max : vx="+maxSpeed[0]+", vy="+maxSpeed[1];
  console.log(result);
}
function clickToAddBoid(event) {
  //console.log(event);
  addBoid(/*event.clientX,event.clientY*/);
}

let t = 0;
let timeLoop = setInterval(timer, settings.interval);
function timer() {
  if(settings.play){
    t++;
    //updateSettings();
    //if(t%2000) logBoidSpeed();
    boids.map(boid => boid.renderBoid(settings, boids, t));
  }
}

function togglePlay() {
  settings.togglePlay();
  let btn = document.getElementById("togglePlay");
  btn.innerHTML = settings.play ? "⏸️": "▶️";
}
function toggleNight() {
  settings.toggleNight();
  let btn = document.getElementById("toggleNight");
  btn.innerHTML = settings.night ? "🌝":"🌚";
  generateRandomBG(settings.night);
}
function stop() {
  settings.play = false;
  clearInterval(timeLoop);
}
