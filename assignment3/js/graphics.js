var camera;
var scene;
var renderer;
var objs = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

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
    renderer.domElement.addEventListener( 'click', pickObj, false );
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

// mouse click to pick object on the scene
function pickObj(e){
    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( mouse, camera );    

    //3. compute intersections
    var intersects = raycaster.intersectObjects( scene.children );

    for ( var i = 0; i < intersects.length; i++ ) {
        console.log( intersects[ i ] ); 
        /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
        */
    }
}