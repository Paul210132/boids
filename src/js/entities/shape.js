export default class shape{

  constructor(settings,params){
    this.settings = settings;
    this.name = params.name || "";
    this.type = params.type || "";
    this.color = params.color || "black";
    this.boidId = params.boidId || undefined;
    this.update(params);
  }
  update(params){
    this.coord = params.coord;
    this.selected = params.selected || false;
    this.border = {
      color : this.settings.night || this.selected ? "white" : "black",
      width : this.selected ? "5" : "1.0"
    };
  }

  // ---------------- Draw ---------------- //
  draw(canvas){
    let c = this.coord;
    switch (this.type) {
      case "line":
        this.drawLine(c.x0,c.y0,c.x1,c.y1,canvas);
        break;
      case "boid":
        this.drawBoid(c.x,c.y,c.phi,canvas);
        break;
      case "grid":
        this.drawGrid(c.step,canvas);
        break;
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
    ctx.strokeStyle = this.border.color;
    ctx.lineWidth = this.border.width;
    ctx.stroke();
  }
  drawBoid(x0,y0,phi_,canvas){
    let phi = phi_+90;
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    //let path = this.boid2DPath(x0,y0,phi);
    let s = this.settings.boidSize;
    let x1=(-s/2), y1=(s), y2=(s/2), x3=(s/2);
    let A = this.rotate({x:0,y:0},{x:x0,y:y0},phi);
    let B = this.rotate({x:x1,y:y1},{x:x0,y:y0},phi);
    let C = this.rotate({x:0,y:y2},{x:x0,y:y0},phi);
    let D = this.rotate({x:x3,y:y1},{x:x0,y:y0},phi);
    ctx.strokeStyle = this.border.color;
    ctx.lineWidth = this.border.width;
    ctx.moveTo(x0,y0);
    ctx.lineTo(B.x,B.y);
    ctx.stroke();
    ctx.arcTo(C.x,C.y,D.x,D.y,s*.69); //nice
    ctx.stroke();
    ctx.lineTo(x0,y0);
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // ---------------- Math ---------------- //
  rotate(vector,origin, phi){
  	return {
    x: vector.x*Math.cos(phi*Math.PI/180)-vector.y*Math.sin(phi*Math.PI/180)+origin.x,
    y: vector.y*Math.cos(phi*Math.PI/180)+vector.x*Math.sin(phi*Math.PI/180)+origin.y
    }
  }
  distanceToShape(shape){
    let distance = {distance:0,angle:0};
    if(this.type!="boid"){
      console.error("Error evaluating distance between "+this.name+"["+this.type+"] and "+shape.name+"["+shape.type+"].");
    } else {
      switch (shape.type) {
        case "line":
          distance = this.distanceToLine(shape.coord);
          break;
        case "boid":
          distance = this.distanceToBoid(shape.coord);
          break;
        default:
      }
    }
    return distance;
  }
  distanceToLine(coord){
    let delta = {};
    if(coord.x0==coord.x1){ // Case 1 : line is vertical
      delta = {
        distance: Math.abs(this.coord.x-coord.x0),
        angle:this.coord.phi%360
      };
    } else if (coord.y0==coord.y1) { // Case 2 : line is horizontal
      delta = {
        distance: Math.abs(this.coord.y-coord.y0),
        angle:Math.abs(this.coord.phi-90)%360
      };
    } else { // Case 3 : line is skewed
      let dx = coord.x1 - coord.x0;
      let dy = coord.y1 - coord.y0;
      delta = {
        distance: Math.abs(dx*(coord.y0-this.coord.y)-dy*(coord.x0-this.coord.x))/Math.sqrt(dx*dx+dy*dy),
        angle:Math.atan(dy/dx)-this.coord.phi
      }
    }
    return delta;
  }
  distanceToBoid(coord){
    return {distance: this.distanceToPoint(coord.x,coord.y), angle:0};
  }
  distanceToPoint(x,y){
    return Math.sqrt((this.coord.x-x)*(this.coord.x-x)+(this.coord.y-y)*(this.coord.y-y));
  }

}
