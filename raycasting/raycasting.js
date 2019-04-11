let STATES = {
  CREATING_POLYGON: 1,
  TO_CREATE_POLYGON: 2,
  CREATING_RAY: 3
};

let Dot = class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let Polygon = class Polygon {
  dots = [];
  addDot(dot){
    this.dots.push(dot);
  }
}

let Ray = class Ray {
  setOrigin(origin) {
    this.origin = origin;
  }

  setAngle(angle) {
    this.angle = angle;
  } 
}

let currentState = STATES.TO_CREATE_POLYGON;

let curUnfinishedPolygon;

let polygons = [];

let curUnfinishedRay;
let rays = [];

function setup(){
  createCanvas(400, 400);
  cleanStateVariables();
}

function mouseClicked(){
  let dot;
  switch(currentState) {
    case STATES.TO_CREATE_POLYGON:
      currentState = STATES.CREATING_POLYGON;

      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);

      console.log(curUnfinishedPolygon);
      break;
    case STATES.CREATING_POLYGON:
      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);    
      console.log(curUnfinishedPolygon);
      break;
    case STATES.CREATING_RAY:
      // does nothing. Everything is done at the on dragging event
      break;
    default:
      alert('BUG: SHOULD NOT ENTER HERE');
  }
}

function doubleClicked() {
  switch(currentState) {
    case STATES.CREATING_POLYGON:
      curUnfinishedPolygon.dots.pop(); // removes last double dot created on doubleClicked
      polygons.push(curUnfinishedPolygon);
      cleanStateVariables();
      currentState = STATES.TO_CREATE_POLYGON;
      break;
    default:
      console.log('Doubleclick with no shape started. Does nothing');
  }
}

function draw() {
  background(204);
  drawPolygons();
  drawCurUnfinishedPolygon();
}

function drawPolygons(){
  fill(150, 10);
  let polygon;
  for (let i = polygons.length - 1; i >= 0; i--) {
    polygon = polygons[i];
    let dot;
    beginShape();
    for (let i = polygon.dots.length - 1; i >= 0; i--) {
      dot = polygon.dots[i];
      vertex(dot.x, dot.y);
    }
    endShape(CLOSE);
  }
}

function drawCurUnfinishedPolygon() {
  fill(150, 10);

  beginShape();
  let dot;
  for (var i = curUnfinishedPolygon.dots.length - 1; i >= 0; i--) {
    dot = curUnfinishedPolygon.dots[i];
    vertex(dot.x, dot.y);
  }
  vertex(mouseX, mouseY);
  endShape(CLOSE);
}

function cleanStateVariables(){
  curUnfinishedPolygon = new Polygon();
  curUnfinishedRay = new Ray();
}

function mouseDragged() {
  if(currentState != STATES.CREATING_RAY) { // if starting to create ray
    currentState = STATES.CREATING_RAY;
    cleanStateVariables();

    curUnfinishedRay.setOrigin(new Dot(pmouseX, pmouseY));
    curUnfinishedRay.setAngle(0);
  }
}

