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
    this.updateAngle();
  }

  updateAngle() {
    let deltaX = this.destiny.x - this.origin.x;
    let deltaY = this.origin.y - this.destiny.y;
    this.angle = atan2(deltaY, deltaX);
  }
}

let curState = STATES.TO_CREATE_POLYGON;

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

function changeMode(){
  curState = STATES[$("input[name='mode']:checked"). val()];
  cleanStateVariables();
}

function mousePressed(){
  let dot;
  switch(curState) {
    case STATES.TO_CREATE_POLYGON:
      curState = STATES.CREATING_POLYGON;

      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);

      break;
    case STATES.CREATING_POLYGON:
      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);    

      break;
    case STATES.CREATING_RAY:
      curUnfinishedRay = new Ray();
      curUnfinishedRay.setOrigin(new Dot(pmouseX, pmouseY));
      curUnfinishedRay.setDestiny(new Dot(mouseX, mouseY));
      
      break;
    default:
      alert('BUG: SHOULD NOT ENTER HERE');
  }
}

function doubleClicked() {
  switch(curState) {
    case STATES.CREATING_POLYGON:
      curUnfinishedPolygon.dots.pop(); // removes last double dot created on doubleClicked
      polygons.push(curUnfinishedPolygon);
      cleanStateVariables();
      curState = STATES.TO_CREATE_POLYGON;
      break;
    default:
      console.log('Doubleclick with no shape started. Does nothing');
  }
}

function mouseDragged() {
  if(curState == STATES.CREATING_RAY) { // if starting to create ray
    curUnfinishedRay.setDestiny(new Dot(mouseX, mouseY));
  }
}

function mouseReleased() {
  if(curState == STATES.CREATING_RAY){
    rays.push(curUnfinishedRay);
    curUnfinishedRay = null;
  }
}

function cleanStateVariables(){
  curUnfinishedPolygon = new Polygon();
  curUnfinishedRay = null;
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
  let arrowLength = 20;

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

  // draws arrow
  arrowEndPoint = new Dot(
    ray.origin.x + arrowLength * Math.cos(ray.angle),
    ray.origin.y - arrowLength * Math.sin(ray.angle)
  );

  line(
    ray.origin.x,
    ray.origin.y,
    arrowEndPoint.x,
    arrowEndPoint.y
  );

  push();
  translate(arrowEndPoint.x, arrowEndPoint.y);
  rotate(radians(90)-ray.angle);
  fill(51);
  beginShape();
  vertex(-arrowLength/4, 0);
  vertex(arrowLength/4, 0);
  vertex(0, - arrowLength/2);
  endShape(CLOSE);
  pop();
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

	return new Dot(x, y);
}

function checkIntersections(){
  let intersection;
  let rayEnd;
  rays.forEach(ray => {
    rayEnd = getRayEndPoint(ray);
    polygons.forEach(polygon => {
      let intersections = [];
      for (let i = 0; i < polygon.dots.length - 1; i++) {
        intersection = intersect(
          ray.origin.x,
          ray.origin.y,
          rayEnd.x,
          rayEnd.y,
          polygon.dots[i].x,
          polygon.dots[i].y,
          polygon.dots[i+1].x,
          polygon.dots[i+1].y
        );
        if(intersection){
          intersections.push(intersection);
        }
      }
    });
  });
}

function getRayEndPoint(ray){
  let dot;
  let i = 1;
  let xCoordinate, yCoordinate;
  let condition = true;
  while(condition){
    i += 1;
    xCoordinate = ray.origin.x + i * Math.cos(ray.angle);
    yCoordinate = ray.origin.y - i * Math.sin(ray.angle);
    if(xCoordinate >= CANVAS_X || yCoordinate >= CANVAS_Y || xCoordinate <= 0 || yCoordinate <= 0){
      condition = false;
      dot = new Dot(xCoordinate, yCoordinate);
    }
  }
  return dot;
}