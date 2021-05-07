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
    canvas_.id = "canvas";
    return canvas_;
  }

  generateObstacles() {
    let edge = this.settings.edgeWidth;
    this.xmin = edge;
    this.ymin = edge;
    this.xmax = window.innerWidth-3*edge;
    this.ymax = window.innerHeight-3*edge;
    this.shapes.push(new shape(this.settings,{name:"topWall",type:"line",coord:{x0:this.xmin,y0:this.ymin,x1:this.xmax,y1:this.ymin}}));
    this.shapes.push(new shape(this.settings,{name:"leftWall",type:"line",coord:{x0:this.xmin,y0:this.ymin,x1:this.xmin,y1:this.ymax}}));
    this.shapes.push(new shape(this.settings,{name:"bottomWall",type:"line",coord:{x0:this.xmin,y0:this.ymax,x1:this.xmax,y1:this.ymax}}));
    this.shapes.push(new shape(this.settings,{name:"rightWall",type:"line",coord:{x0:this.xmax,y0:this.ymax,x1:this.xmax,y1:this.ymin}}));
    if(this.settings.obstacles){
      this.shapes.push(new shape(this.settings,{name:"obstacle",type:"line",coord:{x0:edge*10,y0:(this.ymax-this.ymin)*.4,x1:edge*20,y1:(this.ymax-this.ymin)*.6}}));
      this.shapes.push(new shape(this.settings,{name:"obstacle",type:"line",coord:{x0:edge*20,y0:(this.ymax-this.ymin)*.6,x1:edge*30,y1:(this.ymax-this.ymin)*.4}}));
      this.shapes.push(new shape(this.settings,{name:"obstacle",type:"line",coord:{x0:edge*30,y0:(this.ymax-this.ymin)*.4,x1:edge*40,y1:(this.ymax-this.ymin)*.6}}));
      this.shapes.push(new shape(this.settings,{name:"obstacle",type:"line",coord:{x0:edge*40,y0:(this.ymax-this.ymin)*.6,x1:edge*50,y1:(this.ymax-this.ymin)*.4}}));
      this.shapes.push(new shape(this.settings,{name:"obstacle",type:"line",coord:{x0:edge*50,y0:(this.ymax-this.ymin)*.4,x1:this.xmax,y1:this.ymax}}));
    }
    //shapes.push(new shape(settings,"grid","grid",{step:10},"#ddd"));
  }

  addBoid(){
    let b = new boid(this);
    b.updateBoid();
    this.boids.push(b);
  }

  clearCanvas() {
    this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
    this.shapes = [];
  }

  render(){
    this.clearCanvas();
    this.generateObstacles();
    for(let boid of this.boids) {
      this.shapes.push(boid.shape);
    } for(let boid of this.boids){
      boid.updateBoid();
    } for (let shape of this.shapes) {
      shape.draw(this.canvas);
    }
  }
}
