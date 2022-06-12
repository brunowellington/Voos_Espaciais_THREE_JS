function init() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const xInicialAsteroide = 150;
  let iniciar = false;
  camera.position.set(50, 0, 150);

  //plano de fundo
  //scene.background = new THREE.TextureLoader().load('images/stars.jpg');

  /// fundoo
  scene.background = new THREE.CubeTextureLoader()
    .setPath("images/")
    .load([
      "stars.jpg",
      "stars.jpg",
      "stars.jpg",
      "stars.jpg",
      "stars.jpg",
      "stars.jpg",
    ]);

  //movimentação pelo teclado
  let keydown = [];

  //redimensionando conteudo para caber em tela pequena
  window.addEventListener("resize", function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectMatrix;
  });

  //movimentação da camera
  // var controleMouse = new THREE.OrbitControls(camera, renderer.domElement);
  // controleMouse.update();

  //luzes
  var ambientLight = new THREE.AmbientLight(0x020202);
  scene.add(ambientLight);
  var frontLight = new THREE.DirectionalLight("white", 1);
  frontLight.position.set(0.5, 0.5, 2);
  scene.add(frontLight);
  var backLight = new THREE.DirectionalLight("white", 0.75);
  backLight.position.set(-0.5, -0.5, -2);
  scene.add(backLight);

  //adicionando nave
  let nave = new THREE.Object3D();
  const loader = new THREE.GLTFLoader();
  loader.load("space_shuttle/scene.gltf", function (naveScene) {
    //colocando a naveScene de lado
    nave = naveScene.scene.children[0]; //mover a nave

    nave.rotateZ(90); // ações de rotação e camera da nave
    naveScene.scene.position.set(0, 0, 0);
    scene.add(naveScene.scene);
  });

  //quadradro colisão nave
  const geometry1 = new THREE.BoxGeometry(10, 5, 10);
  const material1 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    visible: false,
  });
  const colisaoNave = new THREE.Mesh(geometry1, material1);
  scene.add(colisaoNave);

  let asteroides = [];
  //adicionando asteroide
  for (let i = 0; i < 3; i++) {
    var geometry = new THREE.SphereGeometry(3, 10, 3);
    var texture = new THREE.TextureLoader().load("images/tex.jpg");
    var materia = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, materia);
    sphere.position.x = xInicialAsteroide;
    sphere.position.y = 40 * (Math.random() - 0.5);
    scene.add(sphere);

    //quadrado colisão asteroide
    const geometry2 = new THREE.BoxGeometry(3, 5, 3);
    const material2 = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      visible: false,
    });
    const colisaoAsteroide = new THREE.Mesh(geometry2, material2);

    colisaoAsteroide.position.set(...sphere.position);

    let colisionBoxAsteroide = new THREE.Box3(
      new THREE.Vector3(),
      new THREE.Vector3()
    );
    colisionBoxAsteroide.setFromObject(colisaoAsteroide);

    //colisão asteroide
    const asteroide = {
      objeto3D: sphere,
      quadradoColisao: colisaoAsteroide,
      colisionBox: colisionBoxAsteroide,
    };

    scene.add(colisaoAsteroide);
    asteroides.push(asteroide);
  }

  //colocando uma posição aleatorio para o asteroide
  function vindoAsteroide() {
    for (let i = 0; i < 3; i++) {
      asteroides[i].objeto3D.position.x = xInicialAsteroide;

      asteroides[i].objeto3D.position.y = 40 * (Math.random() - 0.5);
    }
  }

  ////movimentação pelo teclado
  window.onkeydown = function (e) {
    keydown[e.key] = true;
  };
  window.onkeyup = function (e) {
    keydown[e.key] = false;
  };

  //carregando audio subir
  const walk = new THREE.AudioListener();
  camera.add(walk);
  // criando som de fogo do foguete
  const soundWalk = new THREE.Audio(walk);

  // carregando arquivo de som
  const audioLoaderWalk = new THREE.AudioLoader();
  audioLoaderWalk.load("sounds/motor.mp3", function (buffer) {
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
  audioLoaderWalk1.load("sounds/naveDescer.mp3", function (buffer) {
    soundWalk1.setBuffer(buffer);
    soundWalk1.setLoop(true);
    soundWalk1.setVolume(0.5);
  });

  
  //carregando audio descer
  const walk2 = new THREE.AudioListener();
  camera.add(walk2);
  // criando som de fogo do foguete
  const soundWalk2 = new THREE.Audio(walk2);

  // carregando arquivo de som
  const audioLoaderWalk2 = new THREE.AudioLoader();
  audioLoaderWalk2.load("sounds/explosao.mp3", function (buffer) {
    soundWalk2.setBuffer(buffer);
    soundWalk2.setLoop(false);
    soundWalk2.setVolume(1.0);
  });

  // colisão
  function checkCollision(object1, object2) {
    return object1.intersectsBox(object2);
  }

  //colisão
  let colisionBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  colisionBox.setFromObject(colisaoNave);

  let delta = 1; //velocidade do asteroide
  let velocidade = 0.2; // velocidade da nave

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //controleMouse.update();

    //colisão
    colisaoNave.position.set(...nave.position);
    colisionBox
      .copy(colisaoNave.geometry.boundingBox)
      .applyMatrix4(colisaoNave.matrixWorld);

    //colocando o asteroide para se movimentar
    for (let i = 0; i < 3; i++) {
      if (iniciar == true) {
        asteroides[i].objeto3D.position.x += -1 * delta;
      }
      //colisão
      asteroides[i].quadradoColisao.position.set(
        ...asteroides[i].objeto3D.position
      );
      asteroides[i].colisionBox
        .copy(asteroides[i].quadradoColisao.geometry.boundingBox)
        .applyMatrix4(asteroides[i].quadradoColisao.matrixWorld);

      if (asteroides[i].objeto3D.position.x < -40) {
        vindoAsteroide();
      }

      //colisão
      if (
        checkCollision(colisionBox, asteroides[i].colisionBox) &&
        iniciar == true
      ) {
        iniciar = false;
        vindoAsteroide();
        soundWalk2.play();
        zerar();
      }
    }

    //movimentação pelo teclado e play e pause no audio da nave
    if (nave && keydown["ArrowDown"]) {
      nave.position.y -= velocidade * delta;
      soundWalk1.play();
    }
    if (!keydown["ArrowDown"]) {
      soundWalk1.pause();
    }
    if (nave && keydown["ArrowUp"]) {
      nave.position.y += velocidade * delta;
      soundWalk.play();
    }
    if (!keydown["ArrowUp"]) {
      soundWalk.pause();
    }
    if (keydown["Enter"]) {
      iniciar = true;
      play();
    }
  }
  animate();
}

document.addEventListener("DOMContentLoaded", function (event) {
  init();
});

let count = 0;
const increment = 200; //1s
let interval = null;

const play = () => {
  if (!interval) {
    const contador = document.getElementById("contador");
    interval = setInterval(() => {
      count++;

      contador.innerHTML = formatCount(count);
    }, increment);

    return;
  }
  //console.warn("Ja esta rodando");
};

const stop = () => {
  clearInterval(interval);
  interval = null;
  alert(
    "Você obteve pontuação de: " +
      contador.innerHTML +
      "\n\nDeseja tentar novamente?"
  );
};

const zerar = () => {
  stop();
  count = 0;
  const contador = document.getElementById("contador");
  contador.innerHTML = "0000";
};

const formatCount = (count) => {
  if (count < 10) {
    return "000" + count;
  }

  if (count < 100) {
    return "00" + count;
  }

  if (count < 1000) {
    return "0" + count;
  }

  return count;
};
