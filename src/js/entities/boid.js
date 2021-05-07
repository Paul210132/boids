import {generateRandomBGColor} from '../graphical/painter.js';
//import _settings from '../settings.js';
import shape from './shape.js';

export default class boid {
  constructor(scene) {
    this.scene = scene;
    this.selected = false;
    this.id = this.scene.settings.generateId();
    this.friends = [];
    this.initGeometricalProperties();
    this.createShape();
    this.updateShape();
  }
  defaultParams(){
    return {
      name:"this guy",
      type:"boid",
      coord:
        {
          x:this.x,
          y:this.y,
          phi:this.phi
        },
        color:this.color,
        boidId:this.id,
        selected:this.selected
      };
  }

  // ---------------- UI ---------------- //
  updateBoid(){
    this.solveBehavior();
    this.updateSpeedVector();
    this.incrementPosition();
    this.updateShape();
    this.logger(this.toString());
  }
  createShape(){
    this.color = generateRandomBGColor(this.color,false,0,false);
    this.shape = new shape(this.scene.settings,this.defaultParams());
  }
  updateShape(){
    this.shape.update(this.defaultParams());
  }

 // ---------------- Behavior ---------------- //
  solveBehavior(){
    this.lookAround({proximity:4,collision:{boid:1,wall:4}});
    switch (this.scene.settings.mode) {
      case "gravity":
        this.vy += .1 * this.scene.settings.speedModifier;
      break;
      case "flock":
        this.flock();
      break;
      default:
    }
  }
  lookAround(range){
    this.friends = [];
    let sFactor = this.scene.settings.boidSize;
    for(let shape of this.scene.shapes) {
      if(this.id!=shape.boidId){
        let delta = this.shape.distanceToShape(shape);
        switch (shape.type) {
          case "boid":
            let boid;
            if(delta.distance < sFactor*range.proximity){ // acquire friends
              boid = this.scene.boids.find(boid=>boid.id==shape.boidId);
              this.friends.push(boid);
            } if(delta.distance < sFactor*range.collision.boid){ // avoid boid collision
              this.steer(boid.phi);
            }
            break;
          case "line":
            if(delta.distance < sFactor*range.collision.wall){ // avoid obstacle collision
              this.steer(delta.angle);
            }
            break;
          default:
        }
      }
    }
  }

// ---------------- Position - Modify ---------------- //
initGeometricalProperties(){
  //let margin = this.scene.settings.edgeWidth*4+this.scene.settings.boidSize
  this.x = (Math.random()*(this.scene.xmax-this.scene.xmin)+this.scene.xmin)*.90;
  this.y = (Math.random()*(this.scene.ymax-this.scene.ymin)+this.scene.ymin)*.90;
  this.phi = 180*(2*Math.random()-1);
  this.updateSpeedVector();
}
incrementPosition(){
  if(this.scene.settings.oscillation) this.phi += 5*Math.sin(4*this.x*this.scene.settings.speedModifier/*%2*Math.PI*/);
  let phiRad = Math.PI/180*this.phi;
  this.x+= this.r*Math.cos(phiRad);
  this.y+= this.r*Math.sin(phiRad);
}

// ---------------- Speed - Modify ---------------- //
updateSpeedVector(){
  this.vx = -this.r*Math.sin(this.phi);
  this.vy = this.r*Math.cos(this.phi)
  this.r = this.scene.settings.speedModifier;
}
 flock(){
   let sum = this.phi;
   for(let boid of this.friends){
     sum+=boid.phi;
   }
   this.phi = sum/(this.friends.length+1);
 }
 steer(delta){
   if(delta!=0) this.phi += delta/Math.abs(delta)*5*this.scene.settings.speedModifier;
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
