import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()
// TODO 3: background color (starts black, same as the default)
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(75,
  innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 5, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const sun = new THREE.DirectionalLight(0xffffff, 3)
sun.position.set(4, 6, 5)
scene.add(sun)

scene.add(new THREE.GridHelper(20, 20))
const control = new OrbitControls(camera, renderer.domElement)

const pickables = [];

// TODO 1: different shapes, colors and sizes
// every geometry fits inside a 1x1x1 box, so y = 0.5 * size puts it on the floor
const geometries = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(0.5, 32, 16),
  new THREE.ConeGeometry(0.5, 1, 32),
  new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
  new THREE.TorusGeometry(0.35, 0.15, 16, 48),
  new THREE.OctahedronGeometry(0.5)
]
const colors = [0x00FFFF, 0xFF00FF, 0xFFA500, 0x800080, 0x00FF7F, 0xFFD700];
const sizes = [1, 0.8, 1.2, 1, 1.4, 0.9];

for (let i = 0; i < geometries.length; i++) {
  const material = new THREE.MeshStandardMaterial({ color: colors[i] })
  const mesh = new THREE.Mesh(geometries[i], material)

  mesh.name = 'Objekti' + (i + 1)
  mesh.scale.setScalar(sizes[i])
  mesh.position.set(-7.5 + i * 3, 0.5 * sizes[i], 0)

  scene.add(mesh)
  pickables.push(mesh)
}

const pointer = new THREE.Vector2();

function updatePointers(event) {
  const rect = renderer.domElement.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top

  const W = rect.width
  const H = rect.height


  pointer.x = (2 * px) / W - 1;
  pointer.y = 1 - (2 * py) / H;
}
let selected = null;
let dragging = false;
const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('pointerdown', (event) => {
  updatePointers(event)
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(pickables)
  //ja heqim glowin te objekti i vjeter
  if (selected) {
    selected.material.emissive.setHex(0x000000)
  }
  selected = hits.length > 0 ? hits[0].object : null;
  //objekti i ri i selektuar
  if (selected) {
    selected.material.emissive.setHex(0x882200)
    dragging = true;
    control.enabled = false;
    // show the size of the selected object on the slider
    params.madhesia = selected.scale.x
    sizeControl.updateDisplay()
  }
})

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const intersect = new THREE.Vector3()
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) {
    return
  }
  updatePointers(event);
  raycaster.setFromCamera(pointer, camera)
  if (raycaster.ray.intersectPlane(plane, intersect)) {
    selected.position.x = intersect.x;
    selected.position.z = intersect.z;
  }
})
renderer.domElement.addEventListener('pointerup', (event) => {
  dragging = false;
  control.enabled = true;
})

const startPositions = pickables.map((obj) => obj.position.clone());
// TODO 2: also remember the starting scale of every object
const startScales = pickables.map((obj) => obj.scale.clone());
const gui = new GUI();

const params = {
  madhesia: 1,
  ngjyraSfondit: '#000000'
}

// slider that changes the size of the selected object (so Reset has a scale to restore)
const sizeControl = gui.add(params, 'madhesia', 0.3, 3, 0.1).name('Madhësia e objektit')
sizeControl.onChange((value) => {
  if (selected) {
    selected.scale.setScalar(value)
    selected.position.y = 0.5 * value // keep it standing on the floor
  }
})

gui.add({
  reset() {
    for (let i = 0; i < pickables.length; i++) {
      pickables[i].position.copy(startPositions[i])
      pickables[i].scale.copy(startScales[i])
    }
    // remove the highlight too, so everything is back to how it started
    if (selected) {
      selected.material.emissive.setHex(0x000000)
      selected = null
    }
    params.madhesia = 1
    sizeControl.updateDisplay()
  }
}, 'reset').name('Rivendos Objektet')

// TODO 3: color picker for the background
gui.addColor(params, 'ngjyraSfondit').name('Ngjyra e sfondit').onChange((value) => {
  scene.background.set(value)
})

function loop() {
  requestAnimationFrame(loop)
  control.update()
  renderer.render(scene, camera)
}
loop()
