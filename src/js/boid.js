import {generateRandomBGColor} from './painter.js';
import _settings from './settings.js';
import shape from './shape.js';

export default class boid {
  constructor(settings) {
    this.settings = settings || new _settings();
    this.selected = true;
    this.id = this.settings.generateId();
    this.friends = [];
    this.initGeometricalProperties();
    this.createBoidShape();
    this.updateSpeedVector();
    this.updateGraphicalProperties(settings.canvas);
  }

  // ---------------- UI ---------------- //
  renderBoid(settings, boids, t){
   this.settings = settings;
   this.updateGraphicalProperties(settings.canvas);
   this.applyBehavior(boids);
   this.bounceOffEdge();
   this.updateSpeedVector();
   this.incrementPosition(t);
   this.logger(this.toString());
  }
  createBoidShape(){
    this.color = generateRandomBGColor(this.color,false,0,false);
    this.boidShape = new shape(this.settings,"this guy","boid",{x:this.x,y:this.y,phi:this.phi},this.color);
    // document.body.appendChild(this.boidElement);
    // this.boidElement.innerHTML = "<b>"+this.id+"</b>";
    // this.boidElement.addEventListener("click",this.selectBoid.bind(this));
    // this.boidElement.id = this.id;
    // this.boidElement.className = "boid";
  }
  updateGraphicalProperties(canvas){
    // this.updateColor();
    // this.updateSize();
    // let updatedPosition = "translate("+this.x+"px,"+(window.innerHeight-this.y)+"px) rotate("+this.phi+"deg)";
    // this.boidElement.style.transform = updatedPosition;
    this.boidShape.updateCoordinates({x:this.x,y:this.y,phi:this.phi});
    this.boidShape.draw(canvas)
  }
  updateSize(){
    let s = this.settings.boidSize;
    this.boidElement.style.height = 5*s+"px";
    this.boidElement.style.width = 5*s+"px";
    this.boidElement.style.borderRadius = 4*s+"px";
  }
  updateColor(){

    this.boidElement.style.background = this.color;
    let borderColor = this.selected ? "darkred":"black";
    this.boidElement.style.borderColor = borderColor;
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

 // ---------------- Position - Eval ---------------- //
 detectDistance(boid, distance){
   return (this.distanceToBoid(boid) < distance);
 }
 detectProximity(boid){
   return this.detectDistance(boid, this.settings.boidSize*12);
 }
 detectCollision(boid){
   let collision = this.detectDistance(boid, this.settings.boidSize*5);
   return collision;
 }
 distanceToBoid(boid){
   let d = Math.sqrt((this.x-boid.x)*(this.x-boid.x)+(this.y-boid.y)*(this.y-boid.y));
   //console.log("dist #"+this.id+" to #"+boid.id+" : "+d);
   return d;
 }

// ---------------- Position - Modify ---------------- //
initGeometricalProperties(){
  let margin = this.settings.edgeWidth*4+this.settings.boidSize
  this.x = (Math.random()*(window.innerWidth-margin)+margin)*.90;
  this.y = (Math.random()*(window.innerHeight-margin)+margin)*.90;
  this.phi = 180*(2*Math.random()-1);
  this.updateSpeedVector();
  // let phi = Math.atan(vx/vy)*180/Math.PI;
  // this.phi = (phi + this.alpha(vx,vy))%360;
}
incrementPosition(t){
  let phiRad = Math.PI/180*this.phi;
  this.x+= this.r*Math.sin(phiRad)*t;
  this.y+= this.r*Math.cos(phiRad)*t;
}

// ---------------- Speed - Modify ---------------- //
updateSpeedVector(){
  this.vx = this.r*Math.sin(this.phi);
  this.vy = this.r*Math.cos(this.phi)
  this.r = this.settings.speedModifier;
}
 bounceOffEdge(){
   //bounce off the edge
   let bounceLeft = this.x > .96*(window.innerWidth - this.settings.edgeWidth);
   let bounceRight = this.x < this.settings.edgeWidth;
   let bounceUp = this.y > .93*(window.innerHeight - this.settings.edgeWidth);
   let bounceDown = this.y < this.settings.edgeWidth;
   if(bounceLeft || bounceRight){
     //right/left edge
     this.phi = -this.phi;
     this.logger("bounce : x="+this.x+" edge="+window.innerWidth);
   }if(bounceUp || bounceDown){
     //top/btm edge
     let alpha = this.alpha(Math.sin(this.phi),Math.cos(this.phi));
     this.phi += alpha;
     this.logger("bounce : y="+this.y+" edge="+window.innerHeight);
   }
 }
 flock(boid){
   let sum = 0;
   for(let boid of this.friends){
     sum+=boid.phi;
   }
   this.phi = sum/this.friends.length;
   // this.vx = (.7*this.vx+.3*boid.vx/*+this.dx(boid)*/);
   // this.vy = (.7*this.vy+.3*boid.vy/*+this.dy(boid)*/);
 }
 steerClear(boid){
   let ran = 2*Math.random()-1;
   this.phi += ran/Math.abs(ran)*5;
   // this.vx = -this.vx;// this.dx(boid)/2;
   // this.vy = -this.vy;// this.dy(boid)/2;
 }
 // ---------------- Speed - Eval ---------------- //
 alpha(x,y){
   return y < 0 ? x/Math.abs(x)*180 : 0;
 }
 // ---------------- Debug ---------------- //
 logger(string){
   if(this.selected) console.log(string);
 }
 toString(){
   return ("Boid#"+this.id+"\nx: "+this.x+"\ny: "+this.y+"\nvx: "+this.vx+"\nvy: "+this.vy+"\nphi: "+this.phi);
 }
 selectBoid() {
   this.selected = !this.selected;
 }
}
