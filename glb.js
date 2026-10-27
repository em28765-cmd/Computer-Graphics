import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth/window.innerHeight,
  0.1,
  100
)
camera.position.set(5,8,4)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera,renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35)
const dir = new THREE.DirectionalLight(0xffffff, 2.5)
dir.position.set(5,8,4)
scene.add(dir, ambientLight)

const loader = new GLTFLoader();
loader.load('public/modeli.glb', (gltf) => {
    gltf.scene.rotation.y = Math.PI
    scene.add(gltf.scene);

    // to do: te shfaqen te gjitha Meshes qe jan perdorur te modeli.glb, ne consolelog
    let count = 0
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            count++
            console.log(child.name, child)
        }
    })
    console.log('Meshes gjithsej:', count)
})

function animate() {
  requestAnimationFrame(animate)
  control.update()
  renderer.render(scene,camera)
}
animate()
