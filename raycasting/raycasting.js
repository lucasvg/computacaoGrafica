let STATES = {
  CREATING_POLYGON: 1,
  READY: 2,
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

  setDestiny(destiny) {
    this.destiny = destiny;
    this.updateAngle();
  }

  updateAngle() {
    let deltaX = this.destiny.x - this.origin.x;
    let deltaY = this.origin.y - this.destiny.y;
    this.angle = atan2(deltaY, deltaX);
  }
}

let currentState = STATES.READY;

let curUnfinishedPolygon;

let polygons = [];

let curUnfinishedRay;
let rays = [];

CANVAS_X = 400;
CANVAS_Y = 400;

function setup(){
  createCanvas(CANVAS_X, CANVAS_Y);
  cleanStateVariables();
}

function mousePressed(){
  let dot;
  switch(currentState) {
    case STATES.READY:
      currentState = STATES.CREATING_POLYGON;

      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);

      break;
    case STATES.CREATING_POLYGON:
      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);    

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
      currentState = STATES.READY;
      break;
    default:
      console.log('Doubleclick with no shape started. Does nothing');
  }
}

function draw() {
  background(204);
  drawPolygons();
  drawCurUnfinishedPolygon();
  drawRays();
  drawCurUnfinishedRay();
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

function drawRays(){
  let ray;
  for (let i = rays.length - 1; i >= 0; i--) {
    ray = rays[i];
    drawRay(ray);
  }
}

function drawCurUnfinishedRay() {
  if(curUnfinishedRay)
    drawRay(curUnfinishedRay);
}

function drawRay(ray){
  let STEP = 2;
  let condition = true;
  let i = 0;
  let xCoordinate;
  let arrowLength = 30;

  // draws infinite dotted line
  while(condition){
    i += STEP;
    xCoordinate = ray.origin.x + i * Math.cos(ray.angle);
    yCoordinate = ray.origin.y - i * Math.sin(ray.angle);
    point(xCoordinate, yCoordinate);
    if(xCoordinate >= CANVAS_X || yCoordinate >= CANVAS_Y || xCoordinate <= 0 || yCoordinate <= 0){
      condition = false;
    }
  }

  // draws line
  line(
    ray.origin.x,
    ray.origin.y,
    ray.origin.x + arrowLength * Math.cos(ray.angle),
    ray.origin.y - arrowLength * Math.sin(ray.angle)
  )
}

function cleanStateVariables(){
  curUnfinishedPolygon = new Polygon();
  curUnfinishedRay = null;
}

function mouseDragged() {
  if(currentState != STATES.CREATING_RAY) { // if starting to create ray
    currentState = STATES.CREATING_RAY;
    cleanStateVariables();

    curUnfinishedRay = new Ray();
    curUnfinishedRay.setOrigin(new Dot(pmouseX, pmouseY));
    curUnfinishedRay.setDestiny(new Dot(mouseX, mouseY));
  } else { // is changing angle
    curUnfinishedRay.setDestiny(new Dot(mouseX, mouseY));
  }
}

function mouseReleased() {
  if(currentState == STATES.CREATING_RAY){
    rays.push(curUnfinishedRay);
    curUnfinishedRay = null;
    currentState = STATES.READY;
  }
}
