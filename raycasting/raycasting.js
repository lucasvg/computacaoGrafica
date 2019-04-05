let STATES = {
  CREATING_POLYGON: 1,
  TO_CREATE_POLYGON: 2
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

let currentState = STATES.TO_CREATE_POLYGON;

let curUnfinishedPolygon;


function setup(){
  createCanvas(400, 400);
}

function mouseClicked(){
  let dot;
  switch(currentState) {
    case STATES.TO_CREATE_POLYGON:
      currentState = STATES.CREATING_POLYGON;

      curUnfinishedPolygon = new Polygon();

      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);

      console.log(curUnfinishedPolygon);
      break;
    case STATES.CREATING_POLYGON:
      dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygon.addDot(dot);    
      console.log(curUnfinishedPolygon);
      break;
    default:
      alert('BUG: SHOULD NOT ENTER HERE');
  }
}