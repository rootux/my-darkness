import {
  EffectComposer,
  BloomEffect,
  SMAAEffect,
  RenderPass,
  EffectPass
} from 'postprocessing'
import { WebGLRenderer, Scene, PerspectiveCamera, PointLight } from 'three'
import Man from './objects/Man'
import OrbitControls from './controls/OrbitControls'
import { preloader } from './loader'
import { TextureResolver } from './loader/resolvers/TextureResolver'
import { ImageResolver } from './loader/resolvers/ImageResolver'
import { GLTFResolver } from './loader/resolvers/GLTFResolver'

/* Custom settings */
const SETTINGS = {
  useComposer: true
}
let composer
let stats

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer()
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)
renderer.setClearColor(0x3d3b33)

/* Main scene and camera */
const scene = new Scene()
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
const controls = new OrbitControls(camera)
camera.position.z = 10
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

/* Preloader */
preloader.init(new ImageResolver(), new GLTFResolver(), new TextureResolver())
preloader.load([
  { id: 'searchImage', type: 'image', url: SMAAEffect.searchImageDataURL },
  { id: 'areaImage', type: 'image', url: SMAAEffect.areaImageDataURL },
  { id: 'man', type: 'gltf', url: 'assets/models/man.gltf' },
  { id: 'env', type: 'texture', url: 'assets/textures/pisa.jpg' }
]).then(() => {
  initPostProcessing()
  onResize()
  animate()

  /* Actual content of the scene */
  man = new Man()
  scene.add(man)
})

/* some stuff with gui */
if (DEVELOPMENT) {
  const guigui = require('guigui')
  guigui.add(SETTINGS, 'useComposer')

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

/**
  RAF
*/

const maxLightDistance = 15;
let direction = 1;
const lightSpeed = 0.05;

function animate() {
  window.requestAnimationFrame(animate)
  if(frontLight) {
    console.log(frontLight.position);
    // console.log(camera);
    // camera.position.x = -4;
    // camera.quaternion.x -= 0.05;
    // camera.quaternion.y -= 0.05;
    // camera.position.x = radius * Math.cos( angle );  
    // camera.position.z = radius * Math.sin( angle );
    // angle += 0.01;
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

  if (DEVELOPMENT) {
    stats.end()
  }
}
