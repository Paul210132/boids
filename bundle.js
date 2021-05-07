(function () {
  'use strict';

  function mapPanelControls(){
    let componentMap = [
      {id:"dragme",event:"mousedown",f:grabPanel},
      {id:"dragme",event:"mouseenter",f:hoverPanel},
      {id:"dragme",event:"mouseleave",f:dropPanel}
    ];
    componentMap.forEach((item) => {
        const comp = document.getElementById(item.id);
        comp.addEventListener(item.event,item.f);
    });
    var dm = document.getElementById('dragme');
    dm.addEventListener('dragstart',drag_start,false);
    document.body.addEventListener('dragover',drag_over,false);
    document.body.addEventListener('drop',drop,false);
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
  function grabPanel() {
    setCursor("grabbing");
  } function hoverPanel() {
    setCursor("grab");
  } function dropPanel() {
    setCursor("default");
  } function setCursor(cursor) {
    document.body.style.cursor = cursor;
  }

  function generateRandomBG(night) {
    let cont = document.getElementById("container");
    cont.style.backgroundColor = generateRandomBGColor("", false, .85, night);
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
  function generateRandomBGColor(color, gradient, cursorIndex, night) {
    let randomizer = night ? randomFloatFromZeroToIndex : randomFloatFromIndexToOne;
    let bg = color ? color : "rgb("+randomizer(cursorIndex,255)+","+randomizer(cursorIndex,255)+","+randomizer(cursorIndex,255)+")";
    if (gradient){
      let gradientDirections = ['to bottom','to top','to left','to right','to top right','to top left','to bottom right','to bottom left'];
      bg = "linear-gradient("+randomStringFromArray(gradientDirections)+", "+bg+" 10%, #ffffff 100%)";
    }
    return bg;
  }

  class settings$1 {
    constructor(params){
      this.edgeWidth = params.edgeWidth ? params.edgeWidth : 10;
      this.speedModifier = params.speedModifier ? params.speedModifier : .050;
      this.boidSize = params.boidSize ? params.boidSize : 10;
      this.mode = params.mode ? params.mode : "random";
      this.play = params.play ? params.play : true;
      this.night = params.night ? params.night : false;
      this.interval  = params.interval ? params.interval : 50;
      this.oscillation  = params.oscillation ? params.oscillation : false;
      this.obstacles  = params.obstacles ? params.obstacles : false;
      this.currentId = 1;
    }
    setSpeedModifier(speedModifier) {
        this.speedModifier = parseFloat(speedModifier) || this.speedModifier;
    }
    setEdgeWidth(edgeWidth) {
        this.edgeWidth = parseFloat(edgeWidth) || this.edgeWidth;
    }
    setBoidSize(boidSize) {
        this.boidSize = parseFloat(boidSize) || this.boidSize;
    }
    setMode(mode) {
        this.mode = mode || this.mode;  }
    setOscillation(oscillation) {
        this.oscillation = oscillation;
    }
    setObstacles(obstacles) {
        this.obstacles = obstacles;
    }
    togglePlay(){
        this.play = !this.play;
    }
    toggleNight(){
        this.night = !this.night;
    }
    generateId(){
      return this.currentId++;
    }
  }

  class shape{

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
      this.rotate({x:0,y:0},{x:x0,y:y0},phi);
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
        }
      }
      return distance;
    }
    distanceToLine(coord){
      let delta = {};
      if(coord.x0==coord.x1){ // Case 1 : line is vertical
        delta = {
          distance: Math.abs(this.coord.x-coord.x0),
          angle:this.coord.phi
        };
      } else if (coord.y0==coord.y1) { // Case 2 : line is horizontal
        delta = {
          distance: Math.abs(this.coord.y-coord.y0),
          angle:this.coord.phi-90
        };
      } else { // Case 3 : line is skewed
        let dx = coord.x1 - coord.x0;
        let dy = coord.y1 - coord.y0;
        delta = {
          distance: Math.abs(dx*(coord.y0-this.coord.y)-dy*(coord.x0-this.coord.x))/Math.sqrt(dx*dx+dy*dy),
          angle:Math.atan(dy/dx)-thi.coord.phi
        };
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

  class boid {
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
                if(shape.name == "topWall" || shape.name == "bottomWall"){
                  console.log("yo");
                }
                this.steer(delta.angle);
              }
              break;
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
    this.vy = this.r*Math.cos(this.phi);
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

  class scene$1 {
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

  let settings = new settings$1({});
  let scene = new scene$1(settings);
  let cont = document.getElementById("container");
  cont.style.width = innerWidth;
  cont.style.height = innerHeight;
  updateSettingsFromInput();
  generateRandomBG(settings.night);
  mapPanelControls();
  let componentMap = [
    {id:"canvas",event:"click",f:clickBackground},
    {id:"clickToAddBoid",event:"click",f:clickToAddBoid},
    {id:"clear",event:"click",f:clear},
    {id:"togglePlay",event:"click",f:togglePlay},
    {id:"toggleNight",event:"click",f:toggleNight},
    {id:"edgeWidth",event:"change",f:updateSettingsFromInput},
    {id:"speedModifier",event:"change",f:updateSettingsFromInput},
    {id:"boidSize",event:"change",f:updateSettingsFromInput},
    {id:"switchMode",event:"change",f:updateSettingsFromInput},
    {id:"oscillation",event:"change",f:updateSettingsFromInput},
    {id:"obstacles",event:"change",f:updateSettingsFromInput}
  ];
  componentMap.forEach((item) => {
    const comp = document.getElementById(item.id);
    comp.addEventListener(item.event,item.f);
  });

  function toggleNight() {
    settings.toggleNight();
    let btn = document.getElementById("toggleNight");
    btn.innerHTML = settings.night ? "🌝":"🌚";
    generateRandomBG(settings.night);
  }
  function updateSettingsFromInput() {
    settings.setSpeedModifier(document.getElementById("speedModifier").value);
    settings.setEdgeWidth(document.getElementById("edgeWidth").value);
    settings.setBoidSize(document.getElementById("boidSize").value);
    settings.setMode(document.getElementById("switchMode").value);
    settings.setOscillation(document.getElementById("oscillation").checked);
    settings.setObstacles(document.getElementById("obstacles").checked);
  }
  function clickBackground(ev) {
    for(let boid of scene.boids){
      if(boid.shape.distanceToPoint(ev.clientX,ev.clientY)<30){
        boid.selectBoid();
      }
    }
  }
  function clickToAddBoid() {
    for(let i = 0; i<parseInt(document.getElementById("addQty").value); i++){
      scene.addBoid();
    }
  }
  function clear() {
    scene.boids=[];
  }

  // Time Management
  window.requestAnimationFrame(timer);
  function timer() {
    if(settings.play){
      scene.render();
      window.requestAnimationFrame(timer);
    }
  }
  function togglePlay() {
    settings.togglePlay();
    let btn = document.getElementById("togglePlay");
    btn.innerHTML = settings.play ? "⏸️": "▶️";
  }

}());
//# sourceMappingURL=bundle.js.map
