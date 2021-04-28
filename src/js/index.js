import boid from './boid.js';
import painter from './painter.js';

let boids = [];
let edgeWidth = 10;
let speedModifier = .050;
let interval = 100;
let boidSize = 10;
let mode = "random";
let play = false;
let night = false;
let cont = document.getElementById("container");
cont.style.width = innerWidth;
cont.style.height = innerHeight;
painter.generateRandomBG();

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
function grabPanel() {
  document.body.style.cursor = "grabbing";
}
function dropPanel() {
  document.body.style.cursor = "grab";
}
var dm = document.getElementById('dragme');
dm.addEventListener('dragstart',drag_start,false);
document.body.addEventListener('dragover',drag_over,false);
document.body.addEventListener('drop',drop,false);

function updateSettings() {
  edgeWidth = document.getElementById("edgeWidth").value;
  speedModifier = document.getElementById("speedModifier").value;
  //interval = document.getElementById("interval").value;
  boidSize = document.getElementById("boidSize").value;
}

function switchMode() {
  mode = event.currentTarget.value;
}

function addBoid(x,y,vx,vy,color,size) {
  let b = new boid(x,y,vx,vy,color,size);
  b.renderBoid();
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
  addBoid(event.clientX,event.clientY);
}

let t = 0;
let timeLoop = setInterval(timer, interval);
function timer() {
  if(play){
    t++;
    //updateSettings();
    //if(t%2000) logBoidSpeed();
    boids.map(boid => boid.renderBoid());
  }
}

function togglePlay() {
  play = !play;
  let btn = document.getElementById("play");
  btn.innerHTML = play ? "⏸️": "▶️";
}
function toggleNight() {
  night = !night;
  let btn = document.getElementById("toggleNight");
  btn.innerHTML = night ? "🌝":"🌚";
  painter.generateRandomBG();
}
function stop() {
  play = false;
  clearInterval(timeLoop);
}
