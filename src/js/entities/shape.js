export default class shape{

  constructor(settings,name,type,coord,color){
    this.settings = settings;
    this.name = name;
    this.type = type;
    this.color = color || "black";
    this.border = this.settings.night ? "white" : "black";
    this.updateCoordinates(coord);
  }
  updateCoordinates(coord){
    this.coord = coord;
  }
  draw(canvas){
    let c = this.coord;
    switch (this.type) {
      case "line":
        this.drawLine(c.x0,c.y0,c.x1,c.y1,canvas);
        break;
      case "boid":
        this.drawBoid(c.x,c.y,c.phi,canvas);
      case "grid":
        this.drawGrid(c.step,canvas);
      default:

    }
  }
  drawGrid(step, canvas){
    let context = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    for (let x = 0; x < w; x += Math.ceil(w/step)) {
      context.moveTo(x, 0);
      context.lineTo(x, w);
    }
    for (let y = 0; y < h; y += Math.ceil(h/step)) {
      context.moveTo(0, y);
      context.lineTo(h, y);
    }
    context.strokeStyle = this.color;
    context.stroke();
  }
  drawLine(x0,y0,x1,y1,canvas){
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.strokeStyle = this.border;
    ctx.stroke();
  }
  drawBoid(x0,y0,phi_,canvas){
    let phi = phi_+90;
    let s = this.settings.boidSize;
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    let x1=(-s/2), y1=(s), y2=(s/2), x3=(s/2);
    let A = this.rotate({x:0,y:0},{x:x0,y:y0},phi);
    let B = this.rotate({x:x1,y:y1},{x:x0,y:y0},phi);
    let C = this.rotate({x:0,y:y2},{x:x0,y:y0},phi);
    let D = this.rotate({x:x3,y:y1},{x:x0,y:y0},phi);
    ctx.moveTo(x0,y0);
    ctx.strokeStyle = this.border;
    ctx.lineTo(B.x,B.y);
    ctx.stroke();
    ctx.arcTo(C.x,C.y,D.x,D.y,s*.69); //nice
    ctx.stroke();
    ctx.lineTo(x0,y0);
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  // boid2DPath(s){
  //   let path = new Path2D();
  //   let x1=(-s/2), y1=(s), y2=(s/2), x3=(s/2);
  //   path.lineTo(x1,y1);
  //   path.arcTo(0,y2,x3,y1,s*.69); //nice
  //   path.lineTo(0,0);
  //   return path;
  // }
  rotate(vector,origin, phi){
  	return {
    x: vector.x*Math.cos(phi*Math.PI/180)-vector.y*Math.sin(phi*Math.PI/180)+origin.x,
    y: vector.y*Math.cos(phi*Math.PI/180)+vector.x*Math.sin(phi*Math.PI/180)+origin.y
    }
  }
}
