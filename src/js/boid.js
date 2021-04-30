import {generateRandomBGColor} from './painter.js';
import _settings from './settings.js';

export default class boid {
  constructor(settings) {
    this.settings = settings || new _settings();
    this.selected = false;
    this.id = this.settings.generateId();
    this.friends = [];
    this.phi = 0;
    this.initGeometricalProperties();
    this.boidElement = document.createElement("DIV");
    this.boidElement.innerHTML = "<b>"+this.id+"</b>";
    this.updateGraphicalProperties();
    document.body.appendChild(this.boidElement);
    this.boidElement.addEventListener("click",this.selectBoid.bind(this));
    this.boidElement.addEventListener("hover",this.hoverBoid);
    this.boidElement.id = this.id;
  }

  // ---------------- UI ---------------- //
  updateGraphicalProperties(){
    this.boidElement.className = "boid";
    this.color = generateRandomBGColor(this.color,true,0,false);
    this.boidElement.style.background = this.color;
    let s = this.settings.boidSize;
    this.boidElement.style.height = 5*s+"px";
    this.boidElement.style.width = 5*s+"px";
    this.boidElement.style.borderRadius = 4*s+"px";
    let updatedPosition = "translate("+this.x+"px,"+this.y+"px) rotate("+this.phi+"deg)";
    this.boidElement.style.transform = updatedPosition;
    let borderColor = this.selected ? "darkred":"black";
    this.boidElement.style.borderColor = borderColor;
  }
  renderBoid(settings, boids, t){
   this.settings = settings;
   this.updateGraphicalProperties(settings.boidSize);

   // this.boidElement.style.top = this.y+"px";
   //console.log("x:"+this.x+",y:"+this.y);
   this.applyBehavior(boids);
   this.bounceOffEdge();
   this.updateSpeedVector();
   this.x+= this.vx_calc*t;
   this.y+= -this.vy_calc*t;
 }

 // ---------------- Behavior ---------------- //
  applyBehavior(boids){
    if(this.settings.mode == "gravity"){
      this.vy += .1 * this.settings.speedModifier;
    } else {
      this.acquireFriends(boids);
      this.friends.forEach((boid) => {
        if(this.detectCollision(boid)) this.steerClear(boid);
        switch (this.settings.mode) {
          case "flock":
           //Intercept boids in the vicinity
           if(this.detectProximity(boid)) this.flock(boid);
          default:
        }
      });
    }
  }
  acquireFriends(boids){
    this.friends = [];
    boids.forEach((boid) => {
      if(this.id!=boid.id){
       if(this.detectDistance(boid, this.settings.boidSize*12)){ this.friends.push(boid);}
      }
    });
  }

 // ---------------- Position ---------------- //

 // ---------------- Eval ---------------- //
 detectDistance(boid, distance){
   return (this.distanceToBoid(boid) < distance);
 }
 detectProximity(boid){
   return this.detectDistance(boid, this.settings.boidSize*12);
 }
 detectCollision(boid){
   let collision = this.detectDistance(boid, this.settings.boidSize*5)
   /*if(collision){
     console.log("collision");
     console.log(boid.toString());
     console.log(this.toString());
   }*/
   return collision;
 }
 distanceToBoid(boid){
   let d = Math.sqrt((this.x-boid.x)*(this.x-boid.x)+(this.y-boid.y)*(this.y-boid.y));
   //console.log("dist #"+this.id+" to #"+boid.id+" : "+d);
   return d;
 }
 dx(boid){
   return boid.x-this.x;
 }
 dy(boid){
   return boid.y-this.y;
 }

// ---------------- Modify ---------------- //
initGeometricalProperties(){
  this.x = Math.random()*window.innerWidth*.90;
  this.y = Math.random()*window.innerHeight*.90;
  this.vx = (2*Math.random()-1);
  this.vy= (2*Math.random()-1);
  this.r = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
  this.updateSpeedVector();
}
// ---------------- Speed ---------------- //

// ---------------- Modify ---------------- //
updateSpeedVector(){
  let alpha = this.vy<0 ? this.vx/Math.abs(this.vx)*180 : 0;
  let phi = Math.atan(this.vx/this.vy)*180/Math.PI;
  this.phi = (phi + alpha);
  if(this.selected) console.log(this.toString());
  this.vx_calc = this.vx*this.settings.speedModifier;
  this.vy_calc = this.vy*this.settings.speedModifier;
}
 bounceOffEdge(){
   //bounce off the edge
   if(this.x > .96*(window.innerWidth - this.settings.edgeWidth) || this.x < this.settings.edgeWidth){
     //right/left edge
     this.vx = -this.vx;
     //console.log("bounce : x="+this.x+" edge="+window.innerWidth);
   }if(this.y > .93*(window.innerHeight - this.settings.edgeWidth) || this.y < this.settings.edgeWidth){
     //top/btm edge
     this.vy = -this.vy;
     //console.log("bounce : y="+this.y+" edge="+window.innerHeight);
   }
 }
 flock(boid){
   this.vx = (.7*this.vx+.3*boid.vx/*+this.dx(boid)*/);
   this.vy = (.7*this.vy+.3*boid.vy/*+this.dy(boid)*/);
 }
 steerClear(boid){
   this.vx = -this.vx;// this.dx(boid)/2;
   this.vy = -this.vy;// this.dy(boid)/2;
 }

 // ---------------- Debug ---------------- //
 toString(){
   return ("Boid#"+this.id+"\nx: "+this.x+"\ny: "+this.y+"\nvx: "+this.vx+"\nvy: "+this.vy+"\nphi: "+this.phi);
 }
 selectBoid() {
   this.selected = !this.selected;
 }
 hoverBoid() {
  this.style.filter = "brightness(0.5)";
 }
}
