import boid from './boid.js';
import generateRandomBG from './painter.js';
import _settings from './settings.js';
import shape from './shape.js';

let settings = new _settings();
let boids = [];
let cont = document.getElementById("container");
cont.style.width = innerWidth;
cont.style.height = innerHeight;
let obstacles = [];
let canvas = generateCanvas();
updateSettingsFromInput();
generateRandomBG(settings.night);
let componentMap = [
  {id:"clickToAddBoid",event:"click",f:clickToAddBoid},
  {id:"clear",event:"click",f:clear},
  {id:"togglePlay",event:"click",f:togglePlay},
  {id:"toggleNight",event:"click",f:toggleNight},
  {id:"dragme",event:"mousedown",f:grabPanel},
  {id:"dragme",event:"mouseenter",f:hoverPanel},
  {id:"dragme",event:"mouseleave",f:dropPanel},
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
  settings.setSpeedModifier(document.getElementById("speedModifier").value);
  settings.setEdgeWidth(document.getElementById("edgeWidth").value);
  settings.setBoidSize(document.getElementById("boidSize").value);
  settings.setMode(document.getElementById("switchMode").value);
  settings.setOscillation(document.getElementById("oscillation").checked);
  settings.canvas = canvas;
  updateScene();
}
function generateCanvas() {
  let canvas_ = document.createElement("CANVAS");
  document.body.appendChild(canvas_);
  canvas_.width = window.innerWidth*.99;
  canvas_.height = window.innerHeight*.99;
  return canvas_;
}
function updateScene() {
  clearCanvas();

  let edge = settings.edgeWidth;
  let shapes = [];
  let topLeft = {x:edge,y:edge};
  let topRight = {x:window.innerWidth-3*edge,y:edge};
  let bottomLeft = {x:edge,y:window.innerHeight-3*edge};
  let bottomRight = {x:window.innerWidth-3*edge,y:window.innerHeight-3*edge};
  shapes.push(new shape(settings,"topWall","line",{x0:topLeft.x,y0:topLeft.y,x1:topRight.x,y1:topRight.y},"black"));
  shapes.push(new shape(settings,"leftWall","line",{x0:topLeft.x,y0:topLeft.y,x1:bottomLeft.x,y1:bottomLeft.y},"black"));
  shapes.push(new shape(settings,"bottomWall","line",{x0:bottomLeft.x,y0:bottomLeft.y,x1:bottomRight.x,y1:bottomRight.y},"black"));
  shapes.push(new shape(settings,"rightWall","line",{x0:topRight.x,y0:topRight.y,x1:bottomRight.x,y1:bottomRight.y},"black"));
  //shapes.push(new shape(settings,"grid","grid",{step:10},"#ddd"));
  for(let shape of shapes) { shape.draw(canvas)}
}
function addBoid() {
  let b = new boid(settings);
  b.renderBoid(settings, boids, t);

  boids.push(b);
}
function clear() {
    clearBoids();
    updateScene();
}
function clearBoids() {
  boids=[];
  let elts = document.getElementsByClassName('boid');
  while (elts[0]) {
      document.body.removeChild(elts[0]);
  }
}
function clearCanvas() {
  canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
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

    updateScene();
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
