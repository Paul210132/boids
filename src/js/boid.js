import {generateRandomBGColor} from './painter.js';
import _settings from './settings.js';

export default class boid {
  constructor(x,y,vx,vy,color,size,t, settings) {
    this.settings = settings || new _settings();
    this.id = t;
    this.initGeometricalProperties(x,y,vx,vy);
    this.boidElement = document.createElement("DIV");
    this.updateGraphicalProperties(size, color);
    document.body.appendChild(this.boidElement);
  }

  updateGraphicalProperties(size, color){
    this.boidElement.className = "boid";
    this.color = color || generateRandomBGColor(this.color,true,0,false);
    this.boidElement.style.background = this.color;
    let s = size ? size : this.settings.boidSize;
    this.boidElement.style.height = 5*s+"px";
    this.boidElement.style.width = 5*s+"px";
    this.boidElement.style.borderRadius = 4*s+"px";
  }
  initGeometricalProperties(x,y,vx,vy,settings){
    this.x = x ? x : Math.random()*window.innerWidth*.90;
    this.y = y ? y : Math.random()*window.innerHeight*.90;
    this.vx = (2*Math.random()-1);
    this.vy= (2*Math.random()-1);
    this.updateSpeedVector(vx, vy)
  }
  updateSpeedVector(vx, vy){
    this.vx_calc = vx ? vx : this.vx*this.settings.speedModifier;
    this.vy_calc = vy ? vy : this.vy*this.settings.speedModifier;
  }
  renderBoid(settings, boids, t){
   this.settings = settings;
   this.updateGraphicalProperties(settings.boidSize)
   this.boidElement.style.left = this.x+"px";
   this.boidElement.style.top = this.y+"px";
   //console.log("x:"+this.x+",y:"+this.y);
   this.applyBehavior(boids);
   this.bounceOffEdge();
   this.updateSpeedVector();
   this.x+= this.vx_calc*t;
   this.y+= this.vy_calc*t;
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

 applyBehavior(boids){
   if(this.settings.mode == "gravity"){
     this.vy += .1 * this.settings.speedModifier;
   } else {
     boids.forEach((boid) => {
       if(boid.id!=this.id){
         if(this.detectCollision(boid)) this.steerClear(boid);
         switch (this.settings.mode) {
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
