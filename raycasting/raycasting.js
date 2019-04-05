let STATES = {
  CREATING_POLYGOM: 1,
  TO_CREATE_POLYGOM: 2
};

let currentState = STATES.TO_CREATE_POLYGOM;

function setup(){
  createCanvas(400, 400);
}

function mouseClicked(){
  switch(currentState) {
    case STATES.TO_CREATE_POLYGOM:
      currentState = STATES.CREATING_POLYGOM;
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