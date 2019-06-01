var camera;
var scene;
var renderer;
function runGraphics(){
    setupThree();
    setupModels();
    animate();
}

function setupThree(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function setupModels(){
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
}

function animate() {
    requestAnimationFrame( animate );
    animationTasks();
    renderer.render( scene, camera );
}

function animationTasks(){
}