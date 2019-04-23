let STATES = {
  CREATING_POLYGON: 1,
  TO_CREATE_POLYGON: 2,
  CREATING_RAY: 3,
  EDITING: 4
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
    this.fixesDestinyDistance();
  }

  fixesDestinyDistance() {
    this.destiny.x = this.origin.x + RAY_ARROW_LENGTH * Math.cos(this.angle);
    this.destiny.y = this.origin.y - RAY_ARROW_LENGTH * Math.sin(this.angle);
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

let rays = [];

let intersectionSets = [];

let EDITING_CIRCLE_DIAMETER = 4;

let editableDots;

let curEditedDot;

let RAY_ARROW_LENGTH = 20;

CANVAS_X = 400;
CANVAS_Y = 400;

function setup(){
  createCanvas(CANVAS_X, CANVAS_Y);
  cleanStateVariables();
}

function changeMode(){
  curState = STATES[$("input[name='mode']:checked"). val()];
  cleanStateVariables();

  if(curState == STATES.EDITING)
    loadEditableDots();
}

function loadEditableDots(){
  editableDots = [];
  polygons.forEach(polygon => {
    polygon.dots.forEach(dot => {
      editableDots.push(dot)
    });
  });
  rays.forEach(ray => {
    editableDots.push(ray.origin);
    editableDots.push(ray.destiny);
  });
}

function mousePressed(){
  let dot;
  switch(curState) {
    case STATES.TO_CREATE_POLYGON:
      curState = STATES.CREATING_POLYGON;

      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);

      checkIntersections();

      break;
    case STATES.CREATING_POLYGON:
      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);    
      checkIntersections();
      break;
    case STATES.CREATING_RAY:
      let ray = new Ray();
      ray.setOrigin(new Dot(pmouseX, pmouseY));
      ray.setDestiny(new Dot(mouseX, mouseY));
      rays.push(ray);

      checkIntersections();
      break;
    case STATES.EDITING:
      let clickedPoint = new Dot(mouseX, mouseY);
      for (let i = 0; i < editableDots.length; i++) {
        if(getDistance(clickedPoint, editableDots[i]) < EDITING_CIRCLE_DIAMETER){
          curEditedDot = editableDots[i];
          break;
        }
      }
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
      checkIntersections();
      break;
    default:
      console.log('Doubleclick with no shape started. Does nothing');
  }
}

function mouseDragged() {
  switch (curState) {
    case STATES.CREATING_RAY:
      rays[rays.length-1].setDestiny(new Dot(mouseX, mouseY));
      checkIntersections();  
      break;
    case STATES.EDITING:
      if(curEditedDot != null){
        curEditedDot.x = mouseX;
        curEditedDot.y = mouseY;
        checkIntersections();
        rays.forEach(ray => {
          ray.updateAngle();
          ray.fixesDestinyDistance();
        });
      }
      break;
    default:
      break;
  }
}

function mouseReleased(){
  switch (curState) {
    case STATES.EDITING:
        curEditedDot = null;
      break;
    default:
      break;
  }
}

function cleanStateVariables(){
  curUnfinishedPolygon = new Polygon();
}

function draw() {
  background(204);
  drawPolygons();
  drawCurUnfinishedPolygon();
  drawRays();
  drawIntersections();

  if(curState == STATES.EDITING)
    drawEditing();
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

function drawRay(ray){
  let STEP = 2;
  let condition = true;
  let i = 0;
  let xCoordinate;

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

  line(
    ray.origin.x,
    ray.origin.y,
    ray.destiny.x,
    ray.destiny.y
  );

  push();
  translate(ray.destiny.x, ray.destiny.y);
  rotate(radians(90)-ray.angle);
  fill(51);
  beginShape();
  vertex(-RAY_ARROW_LENGTH/4, 0);
  vertex(RAY_ARROW_LENGTH/4, 0);
  vertex(0, - RAY_ARROW_LENGTH/2);
  endShape(CLOSE);
  pop();
}

function drawIntersections(){
  intersectionSets.forEach(intersectionSet => {
    intersectionSet.forEach(intersection => {
      circle(intersection.x, intersection.y, 4);
    });
  });
}

function drawEditing(){
  push();
  noStroke();
  fill(255, 101, 192, 255);
  editableDots.forEach(dot => {
    circle(dot.x, dot.y, EDITING_CIRCLE_DIAMETER);    
  });
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
  intersectionSets = [];
  rays.forEach(ray => {
    setRayEnd(ray);
    polygons.forEach(polygon => {
      let intersectionSet = getIntersectionSet(ray, polygon);
      if(intersectionSet.length > 0)
        intersectionSets.push(intersectionSet);
    });
  });
}

function getIntersectionSet(ray, polygon){
  let intersectionSet = [];
  for (let i = 0; i < polygon.dots.length; i++) {
    intersection = intersect(
      ray.origin.x,
      ray.origin.y,
      ray.end.x,
      ray.end.y,
      polygon.dots[i].x,
      polygon.dots[i].y,
      polygon.dots[(i+1)%polygon.dots.length].x,
      polygon.dots[(i+1)%polygon.dots.length].y
    );
    if(intersection){
      intersectionSet.push(intersection);
    }
  }
  return intersectionSet;
}

function setRayEnd(ray){
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
  ray.end = dot;
}

function getDistance(dot1, dot2){
  return Math.sqrt((dot1.x-dot2.x)**2 + (dot1.y-dot2.y)**2);
}
