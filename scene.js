
//import stars from '/images/stars.jpg';

function init(){
//contador  
const contador  = document.getElementById("contador") 
contador.innerHTML = 1000;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.set(0,0,180)

//plano de fundo
//scene.background = new THREE.TextureLoader().load('images/stars.jpg');



/// fundoo
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'images/' )
	.load( [
		'stars.jpg',
		'stars.jpg',
		'stars.jpg',
		'stars.jpg',
		'stars.jpg',
		'stars.jpg'
	] );


// scene.background = textureLoader.load('images\stars.jpg').load('images\stars.jpg'); 
// // var cubeTextureLoader = new THREE.CubeTextureLoader();
// // scene.background = cubeTextureLoader.load([
// //     stars,
// //     stars,
// //     stars,
// //     stars,
// //     stars,
// //     stars
// // ]);

//movimentação pelo teclado
let keydown = [];

//redimensionando conteudo para caber em tela pequena
window.addEventListener('resize', function(){
 var width = window.innerWidth;
 var height = window.innerHeight;
 renderer.setSize(width,height);
 camera.aspect = width/height;
 camera.updateProjectMatrix; 
})

//movimentação da camera
var controleMouse = new THREE.OrbitControls(camera,renderer.domElement);
// controleMouse.enableDamping = true;
// controleMouse.screenSpacePanning = false;
// controleMouse.minDistance = 100;
// controleMouse.maxDistance = 500;
// controleMouse.maxPolarAngle = Math.PI / 2;
controleMouse.update();

//luzes
var ambientLight= new THREE.AmbientLight( 0x020202 );
scene.add( ambientLight);
var frontLight	= new THREE.DirectionalLight('white', 1);
frontLight.position.set(0.5, 0.5, 2);
scene.add( frontLight );
var backLight	= new THREE.DirectionalLight('white', 0.75);
backLight.position.set(-0.5, -0.5, -2);
scene.add( backLight );

//adicionando nave
let nave = new THREE.Object3D()
  const loader = new THREE.GLTFLoader();
  loader.load( 'space_shuttle/scene.gltf', function ( naveScene ) {
  //colocando a naveScene de lado
  nave = naveScene.scene.children[0] //mover a nave
  nave.rotateZ(90)   // ações de rotação e camera da nave
  naveScene.scene.position.set(-40,0,0)
  scene.add( naveScene.scene );
} );

let asteroides = [] 
var collidableMeshList = [];

for(let i = 0; i<3; i++){
//adicionando asteroide
var geometry = new THREE.SphereGeometry( 3, 10, 3 );
var texture = new THREE.TextureLoader().load('images/tex.jpg');
var material = new THREE.MeshBasicMaterial( { map: texture } );
const sphere = new THREE.Mesh( geometry, material);
scene.add( sphere );
asteroides.push(sphere)
      
}

//colocando uma posição aleatorio para o asteroide
function vindoAsteroide(){
for(let i = 0; i<3; i++){  
asteroides[i].position.x = 90
asteroides[i].position.x += 5 *  (Math.random()-0.5)
asteroides[i].position.y = 40 * (Math.random()-0.5)
}
}



//   if (asteroides.position.distanceTo(naveScene.position) < 0.3) {
//     asteroides.position.set(2, 0, 0)
// }

 //var distance = nave.distanceTo( asteroides );





// D = RAIZ((BX - AX)² +  (BY - AX)²  )











////movimentação pelo teclado
window.onkeydown = function (e){
  keydown[e.key] = true;
}
window.onkeyup = function (e){
  keydown[e.key] = false;
}

//carregando audio
const walk = new THREE.AudioListener();
  camera.add(walk);
  // criando som de fogo do foguete
  const soundWalk = new THREE.Audio(walk);

  // carregando arquivo de som
  const audioLoaderWalk = new THREE.AudioLoader();
  audioLoaderWalk.load('sounds/motor.mp3', function (buffer) {
    soundWalk.setBuffer(buffer);
    soundWalk.setLoop(true);
    soundWalk.setVolume(0.5);
  });
  
//carregando audio descer
const walk1 = new THREE.AudioListener();
  camera.add(walk1);
  // criando som de fogo do foguete
  const soundWalk1 = new THREE.Audio(walk1);

  // carregando arquivo de som
  const audioLoaderWalk1 = new THREE.AudioLoader();
  audioLoaderWalk.load('sounds/naveDescer.mp3', function (buffer) {
    soundWalk1.setBuffer(buffer);
    soundWalk1.setLoop(true);
    soundWalk1.setVolume(0.5);
  });
    
let delta = 1 //velocidade do asteroide
let velocidade = 0.2; // velocidade da nave
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controleMouse.update();

  //colocando o asteroide para se movimentar
  for(let i = 0; i<3; i++){  
    
    asteroides[i].position.x += -1 *delta;
  if(asteroides[i].position.x <-40){
  vindoAsteroide()
  } 
    }

  
  //movimentação pelo teclado e play e pause no audio da nave
  if(nave && keydown["ArrowDown"]){
    nave.position.y -= velocidade * delta;
    soundWalk1.play();
  }
  if(!keydown["ArrowDown"]){
      soundWalk1.pause();
  }
  if(nave && keydown["ArrowUp"]){
    nave.position.y += velocidade * delta;
    soundWalk.play();
  }
  if(!keydown["ArrowUp"]){
    soundWalk.pause();
}


}
animate()
}

document.addEventListener("DOMContentLoaded", function (event) {
  init();
});