import shape from './shape.js';
import boid from './boid.js';

export default class scene {
  constructor(settings){
    this.settings = settings;
    this.canvas = this.generateCanvas();
    this.shapes = [];
    this.boids = [];
  }

  generateCanvas() {
    let canvas_ = document.createElement("CANVAS");
    document.body.appendChild(canvas_);
    canvas_.width = window.innerWidth*.99;
    canvas_.height = window.innerHeight*.99;
    return canvas_;
  }

  generateObstacles() {
    let edge = this.settings.edgeWidth;
    let topLeft = {x:edge,y:edge};
    let topRight = {x:window.innerWidth-3*edge,y:edge};
    let bottomLeft = {x:edge,y:window.innerHeight-3*edge};
    let bottomRight = {x:window.innerWidth-3*edge,y:window.innerHeight-3*edge};
    this.shapes.push(new shape(this.settings,"topWall","line",{x0:topLeft.x,y0:topLeft.y,x1:topRight.x,y1:topRight.y},"black"));
    this.shapes.push(new shape(this.settings,"leftWall","line",{x0:topLeft.x,y0:topLeft.y,x1:bottomLeft.x,y1:bottomLeft.y},"black"));
    this.shapes.push(new shape(this.settings,"bottomWall","line",{x0:bottomLeft.x,y0:bottomLeft.y,x1:bottomRight.x,y1:bottomRight.y},"black"));
    this.shapes.push(new shape(this.settings,"rightWall","line",{x0:topRight.x,y0:topRight.y,x1:bottomRight.x,y1:bottomRight.y},"black"));
    //shapes.push(new shape(settings,"grid","grid",{step:10},"#ddd"));
  }

  addBoid(t){
    let b = new boid(this);
    b.updateBoid(t);
    this.boids.push(b);
  }

  clearCanvas() {
    this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
    this.shapes = [];
  }

  render(t){
    this.clearCanvas();
    this.generateObstacles();
    for(let boid of this.boids) {
      boid.updateBoid(t);
      this.shapes.push(boid.shape);
    }
    for (let shape of this.shapes) {
      shape.draw(this.canvas);
    }
  }
}
