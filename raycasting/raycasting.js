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

  setDestiny(destiny) {
    this.destiny = destiny;
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
  drawCurUnfinishedRaw();
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

function drawCurUnfinishedRaw() {
  if(curUnfinishedRay)
    line(
      curUnfinishedRay.origin.x,
      curUnfinishedRay.origin.y,
      curUnfinishedRay.destiny.x,
      curUnfinishedRay.destiny.y
    );
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
    curUnfinishedRay.destiny.x = mouseX;
    curUnfinishedRay.destiny.y = mouseY;
  }
}

function mouseReleased() {
  if(currentState == STATES.CREATING_RAY){
    rays.push(curUnfinishedRay);
    curUnfinishedRay = null;
    currentState = STATES.TO_CREATE_POLYGON;
  }
}
