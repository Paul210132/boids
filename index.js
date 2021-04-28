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
generateRandomBG();
function generateRandomBG() {
  let cont = document.getElementById("container");
  let f = night ? randomFloatFromZeroToIndex : randomFloatFromIndexToOne;
  cont.style.backgroundColor = generateRandomBGColor("", false, .85, f);
}
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
function randomStringFromArray(array) {
  let randomNumber = Math.floor(Math.random()*array.length);
  return array[randomNumber];
}
function randomFloatFromIndexToOne(index, span) {
  let result = span*(Math.random()*(1-index)+index);
  return result;
}
function randomFloatFromZeroToIndex(index, span) {
  let result = span*Math.random()*(1-index);
  return result;
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
function generateRandomBGColor(color, gradient, cursorIndex, randomizer) {
  let bg = color ? color : "rgb("+randomizer(cursorIndex,255)+","+randomizer(cursorIndex,255)+","+randomizer(cursorIndex,255)+")";
  if (gradient){
    let gradientDirections = ['to bottom','to top','to left','to right','to top right','to top left','to bottom right','to bottom left'];
    bg = "linear-gradient("+randomStringFromArray(gradientDirections)+", "+bg+" 10%, #ffffff 100%)";
  }
  return bg;
}

class boid {
  constructor(x,y,vx,vy,color,size) {
    this.id = t;
    this.setGeometricalProperties(x,y,vx,vy);
    this.boidElement = document.createElement("DIV");
    this.boidElement.className = "boid";
    this.boidElement.style.background = generateRandomBGColor(color,true,0,randomFloatFromIndexToOne);
    let s = size ? size : boidSize;
    this.boidElement.style.height = 5*s+"px";
    this.boidElement.style.width = 5*s+"px";
    this.boidElement.style.borderRadius = 4*s+"px";
    document.body.appendChild(this.boidElement);
  }

  setGraphicalProperties(color,size){

  }
  setGeometricalProperties(x,y,vx,vy){
    this.x = x ? x : Math.random()*window.innerWidth*.90;
    this.y = y ? y : Math.random()*window.innerHeight*.90;
    this.vx = vx ? vx : (2*Math.random()-1)*speedModifier;
    this.vy = vy ? vy : (2*Math.random()-1)*speedModifier;
  }
  renderBoid(){
   this.boidElement.style.left = this.x+"px";
   this.boidElement.style.top = this.y+"px";
   //console.log("x:"+this.x+",y:"+this.y);
   this.applyBehavior();
   this.bounceOffEdge();

   this.x+= this.vx*t;
   this.y+= this.vy*t;
 }

 bounceOffEdge(){
   //bounce off the edge
   if(this.x > .96*(window.innerWidth - edgeWidth) || this.x < edgeWidth){
     //right/left edge
     this.vx = -this.vx;
     //console.log("bounce : x="+this.x+" edge="+window.innerWidth);
   }if(this.y > .93*(window.innerHeight - edgeWidth) || this.y < edgeWidth){
     //top/btm edge
     this.vy = -this.vy;
     //console.log("bounce : y="+this.y+" edge="+window.innerHeight);
   }
 }

 applyBehavior(){
   if(mode == "gravity"){
     this.vy += .1 * speedModifier;
   } else {
     boids.forEach((boid) => {
       if(boid.id!=this.id){
         if(this.detectCollision(boid)) this.steerClear(boid);
         switch (mode) {
           case "flock":
            //Intercept boids in the vicinity
            if(this.detectProximity(boid)) this.flock(boid);
           default:
         }
       }
     });
   }
 }
 distanceToBoid(boid){
   let d = Math.sqrt((this.x-boid.x)*(this.x-boid.x)+(this.y-boid.y)*(this.y-boid.y));
   //console.log("dist #"+this.id+" to #"+boid.id+" : "+d);
   return d;
 }
 detectDistance(boid, distance){
   return (this.distanceToBoid(boid) < distance);
 }
 detectProximity(boid){
   return this.detectDistance(boid, boidSize*12);
 }
 detectCollision(boid){
   let collision = this.detectDistance(boid, boidSize*5)
   /*if(collision){
     console.log("collision");
     console.log(boid.toString());
     console.log(this.toString());
   }*/
   return collision;
 }
 flock(boid){
   this.vx = (.7*this.vx+.3*boid.vx/*+this.dx(boid)*/);
   this.vy = (.7*this.vy+.3*boid.vy/*+this.dy(boid)*/);
 }
 steerClear(boid){
   this.vx = -this.vx;// this.dx(boid)/2;
   this.vy = -this.vy;// this.dy(boid)/2;
 }
 dx(boid){
   return boid.x-this.x;
 }
 dy(boid){
   return boid.y-this.y;
 }
 toString(){
   return ("Boid#"+this.id+"\nx: "+this.x+"\ny: "+this.y+"\nvx: "+this.vx+"\nvy: "+this.vy);
 }
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
  generateRandomBG();
}
function stop() {
  play = false;
  clearInterval(timeLoop);
}
