import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js"
import {FirstPersonControls  } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/FirstPersonControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader";
import $ from "jquery";

let score=0;

const raycaster = new THREE.Raycaster();
const scene=new THREE.Scene();
scene.background = new THREE.Color( 0xefd1b5 );
const camera=new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .1, 1000);
camera.position.z=10

const clock = new THREE.Clock();
const mouse={
  x: undefined,
  y: undefined
}

//FBX Loader
var targetPrefab;
const fbxLoader = new FBXLoader();


//Set renderer
const renderer =new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild( renderer.domElement );

//Set FirstPersonControls controls
const controls = new FirstPersonControls( camera, renderer.domElement );
controls.movementSpeed = 0;
controls.lookSpeed = 0.025;

//First is fbx model; second is mesh
const currTarget=[null, null];
var targetPrefab;

fbxLoader.load(
  'target.fbx',
  (object) => {

      object.scale.set(.002, .002, .002)
      targetPrefab=object;
      createTarget(0,0);
  },
  (error) => {
      console.log(error)
  })

//Loads a target
function createTarget(x,y){
  var object = targetPrefab.clone();

  //Sets the model's position and size
  object.scale.set(.002, .002, .002)
  object.position.set(x,y,0);
  currTarget[0]=object;
  scene.add(object);

  //Sets the model's geometry size
  const geometry = new THREE.CircleGeometry( .66, 32 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const circle = new THREE.Mesh( geometry, material );
  circle.position.set(x,y,0);
  currTarget[1]=circle;
  scene.add( circle );
}

//Creating a plane
/*
const planeGeometry = new THREE.PlaneGeometry(16, 16,40, 40);
const planeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);*/

//Creating a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, .5, 3);
scene.add(light);

//ANIMATING THE SCENE
function animate(){
  requestAnimationFrame(animate);
  
  //Animating the target
  controls.update(clock.getDelta());
  renderer.render(scene, camera);

  //Checks if target is off the screen
  /*
  camera.updateMatrix();
  camera.updateMatrixWorld();
  var frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));  

  if (currTarget[0]!=null && !frustum.containsPoint(currTarget[0].position)) {
    console.log("out of the screen");
  }*/
}

animate();

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / innerWidth *2 -1;
  mouse.y = -1 * event.clientY/innerHeight * 2 + 1;
})

//Checks if left button is pressed
function detectLeftButton(evt) {
  evt = evt || window.event;
  if ("buttons" in evt) {
      return evt.buttons == 1;
  }
  var button = evt.which || evt.button;
  return button == 1;
}

addEventListener('click', (event) => {
  if (detectLeftButton(event)){
    return;
  }

  //Raycasting hit
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(currTarget[1]);

  //Checks when target is hit
  if (intersects.length>0){

    //Removes old target and adds new one
    scene.remove(currTarget[0]);
    scene.remove(currTarget[1]);

    createTarget(Math.random()* 10 -5, Math.random() * (10) -5);

    score++;
    $("#score").html("SCORE: " + score);
  }
})

renderer.render(scene, camera);

//Resizes the window
function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
  controls.handleResize();
}

window.addEventListener('resize', onWindowResize );

//Stops the camera from moving when the mouse is off the window/screen
$(document).mouseleave(function () {
  controls.enabled=false;
});

//Resumes camera movement when mouse is on the window/screen
$(document).mouseenter(function () {
  controls.enabled=true;
});
