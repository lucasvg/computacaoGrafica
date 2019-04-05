let STATES = {
  CREATING_POLYGOM: 1,
  TO_CREATE_POLYGOM: 2
};

let Dot = class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let Polygram = class Polygram {
  dots = [];
  addDot(dot){
    this.dots.push(dot);
  }
}

let currentState = STATES.TO_CREATE_POLYGOM;

let curUnfinishedPolygom;

function setup(){
  createCanvas(400, 400);
}

function mouseClicked(){
  switch(currentState) {
    case STATES.TO_CREATE_POLYGOM:
      currentState = STATES.CREATING_POLYGOM;

      curUnfinishedPolygom = new Polygram();

      let dot = new Dot(mouseX, mouseY);
      curUnfinishedPolygom.addDot(dot);

      alert('TO_CREATE_POLYGOM');
      alert(mouseX + ' ' + mouseY);
      break;
    case STATES.CREATING_POLYGOM:
      alert('CREATING_POLYGOM');
      break;
    default:
      alert('BUG: SHOULD NOT ENTER HERE');
  }
}