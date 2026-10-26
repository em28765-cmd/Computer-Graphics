import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)
camera.position.set(8,6,12)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({color: 0xcccccc, side: THREE.DoubleSide})
)
ground.rotation.x = -Math.PI/2;
const grid = new THREE.GridHelper(20,20)
scene.add(ground,grid)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const dirLight = new THREE.DirectionalLight(0xffffff, 2)
scene.add(ambientLight,dirLight)

const baseGeometry = new THREE.CylinderGeometry(1.2,1.2,0.5,32)
const baseMaterial = new THREE.MeshStandardMaterial({color: 0x555555})
const base = new THREE.Mesh(baseGeometry, baseMaterial)
scene.add(base)

const shoulder = new THREE.Group()
shoulder.position.y = 0.5
base.add(shoulder)

const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), baseMaterial)
shoulder.add(shoulderJoint)

const armMaterial = new THREE.MeshStandardMaterial({color: 0x3399ff})
const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial)
upperArm.position.y = 1.5
shoulder.add(upperArm)

const elbow = new THREE.Group()
elbow.position.y = 3;
shoulder.add(elbow)

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), baseMaterial)
elbow.add(elbowJoint)

const foreArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, 0.7), armMaterial)
foreArm.position.y = 1.25
elbow.add(foreArm)

const wrist = new THREE.Group();
wrist.position.y = 2.7
elbow.add(wrist)

const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), baseMaterial)
wrist.add(wristJoint)

const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 0.4),
    new THREE.MeshStandardMaterial({color: 0xffaa55})
)
palm.position.y = 1
wrist.add(palm)

const fingers = []
const fingerLength = 1.2
const fingerGeometry = new THREE.BoxGeometry(0.28, fingerLength, 0.3)
const fingerMaterial = new THREE.MeshStandardMaterial({color: 0xffcc88})

const fingerSpacing = 0.36
const lengthScale = [0.75, 1, 1.15, 1, 0.8]

for (let i = 0; i < 5; i++) {
    const fingerJoint = new THREE.Group()
    fingerJoint.position.set((i - 2) * fingerSpacing, 0.75, 0)   

    const finger = new THREE.Mesh(fingerGeometry, fingerMaterial)
    finger.scale.y = lengthScale[i]
    finger.position.y = (fingerLength * lengthScale[i]) / 2   

    fingerJoint.add(finger)
    palm.add(fingerJoint)          
    fingers.push(fingerJoint)
}

shoulder.rotation.z = THREE.MathUtils.degToRad(-20)
elbow.rotation.z = THREE.MathUtils.degToRad(40)
wrist.rotation.z = THREE.MathUtils.degToRad(-20)

const rotationStep = THREE.MathUtils.degToRad(5)

window.addEventListener('keydown', function(event){
    const key = event.key.toLowerCase();
    if(key=='q')
    {
        shoulder.rotation.z += rotationStep
    }
    if(key=='a')
    {
        shoulder.rotation.z -= rotationStep
    }
     if(key=='s')
    {
        elbow.rotation.z += rotationStep
    }
    if(key=='w')
    {
        elbow.rotation.z -= rotationStep
    }
     if(key=='d')
    {
        wrist.rotation.z += rotationStep
    }
    if(key=='e')
    {
        wrist.rotation.z -= rotationStep
    }

})

const control = new OrbitControls(camera, renderer.domElement)
control.enableDamping = true;
function animate()
{
    requestAnimationFrame(animate)
    control.update()
    renderer.render(scene,camera)
}
animate()
