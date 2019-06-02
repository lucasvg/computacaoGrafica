var camera;
var scene;
var renderer;
var objs = [];

function runGraphics(){
    setupThree();
    setupModels();
    animate();
}

function setupThree(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 20;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var control = new THREE.OrbitControls(camera, renderer.domElement);
}

function setupModels(){
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshNormalMaterial();
    
    for (let i = 0; i < 10; i++) {
        let cube = new THREE.Mesh( geometry, material );
        cube.position.x = (Math.random() - 0.5) * 10;
        cube.position.y = (Math.random() - 0.5) * 10;
        cube.position.z = (Math.random() - 0.5) * 10;
        objs.push(cube);
    }

    objs.forEach(obj => {
        scene.add( obj );        
    });
}

function animate() {
    requestAnimationFrame( animate );
    animationTasks();
    renderer.render( scene, camera );
}

function animationTasks(){
}