import {
  EffectComposer,
  BloomEffect,
  SMAAEffect,
  RenderPass,
  EffectPass
} from 'postprocessing'
import { WebGLRenderer, Scene, PerspectiveCamera,
  PointLight, Geometry, Vector3, TextureLoader, Points, PointsMaterial } from 'three'
import Man from './objects/Man'
import OrbitControls from './controls/OrbitControls'
import { preloader } from './loader'
import { TextureResolver } from './loader/resolvers/TextureResolver'
import { ImageResolver } from './loader/resolvers/ImageResolver'
import { GLTFResolver } from './loader/resolvers/GLTFResolver'

/* Custom settings */
const SETTINGS = {
  useComposer: true,
  showStars: true,
}
let composer;
let stats;

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer()
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)
renderer.setClearColor(0x00000)

/* Main scene and camera */
const scene = new Scene()
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
const controls = new OrbitControls(camera)
camera.position.z = 10
camera.rotation.x = Math.PI/2
controls.enableDamping = true
controls.dampingFactor = 0.15
controls.start()

/* Lights */
const frontLight = new PointLight(0xFFFFFF, 1)
// const backLight = new PointLight(0xFFFFFF, 1)
scene.add(frontLight)
// scene.add(backLight)
frontLight.position.set(20, 20, 20)
// backLight.position.set(-20, -20, 20)

/* Various event listeners */
window.addEventListener('resize', onResize)

let man;
let starGeo;
let stars;

/* Preloader */
preloader.init(new ImageResolver(), new GLTFResolver(), new TextureResolver())
preloader.load([
  { id: 'searchImage', type: 'image', url: SMAAEffect.searchImageDataURL },
  { id: 'areaImage', type: 'image', url: SMAAEffect.areaImageDataURL },
  { id: 'man', type: 'gltf', url: 'assets/models/man.gltf' },
]).then(() => {
  initPostProcessing()
  onResize()
  animate()

  /* Actual content of the scene */
  man = new Man()
  scene.add(man)

  starGeo = new Geometry();
  for(let i=0;i<6000;i++) {
    const star = new Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.005;
    starGeo.vertices.push(star);
  }
  let sprite = new TextureLoader().load('./assets/models/star.png' );
  let starMaterial = new PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: sprite
  });

  stars = new Points(starGeo,starMaterial);
  scene.add(stars);
})

/* some stuff with gui */
if (DEVELOPMENT) {
  const guigui = require('guigui')
  guigui.add(SETTINGS, 'useComposer')
  guigui.add(SETTINGS, 'showStars');

  const Stats = require('stats.js')
  stats = new Stats()
  stats.showPanel(0)
  container.appendChild(stats.domElement)
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = 0
  stats.domElement.style.left = 0
}

/* -------------------------------------------------------------------------------- */
function initPostProcessing () {
  composer = new EffectComposer(renderer)
  const bloomEffect = new BloomEffect()
  const smaaEffect = new SMAAEffect(preloader.get('searchImage'), preloader.get('areaImage'))
  const effectPass = new EffectPass(camera, smaaEffect, bloomEffect)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  composer.addPass(effectPass)
  effectPass.renderToScreen = true
}

/**
  Resize canvas
*/
function onResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

const maxLightDistance = 15;
let direction = 1;
const lightSpeed = 0.05;

function animate() {
  window.requestAnimationFrame(animate)
  if(frontLight) {
    if(frontLight.position.z >= maxLightDistance) {
      direction = -1;
    }
    if(frontLight.position.z <= -maxLightDistance) {
      direction = 1;
    }
    frontLight.position.z += (lightSpeed * direction);
  }
  if(man) {
    man.rotation.y += 0.005;
  }

  // Star animation
  if(starGeo) {
    starGeo.vertices.forEach(p => {
      p.velocity += p.acceleration
      p.z += p.velocity;
      
      if (p.z > 200) {
        p.z = -200;
        p.velocity = 0;
      }
    });
    starGeo.verticesNeedUpdate = true;
    stars.rotation.z -=0.002;
  }

  render()
}

/**
  Render loop
*/
function render () {
  if (DEVELOPMENT) {
    stats.begin()
  }

  controls.update()
  if (SETTINGS.useComposer) {
    composer.render()
  } else {
    renderer.clear()
    renderer.render(scene, camera)
  }

  if (SETTINGS.showStars) {
    if(stars) {
      stars.visible = true;
    }
  } else {
    if(stars) {
      stars.visible = false;
    }
  }

  if (DEVELOPMENT) {
    stats.end()
  }
}
