import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Plane } from 'three';
// import * as dat from 'dat.gui';

// Debug
// const gui = new dat.GUI();

// Texture loader
const loader = new THREE.TextureLoader();
const particleShape = loader.load('./img/hexagon.png');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
// const geometry = new THREE.TorusGeometry( 0.7, 0.2, 16, 100 );
// const geometry = new THREE.IcosahedronGeometry(1, 0);
const geometry = new THREE.SphereGeometry();

// Background particles
const particleGeom = new THREE.BufferGeometry();
const particleCount = 5000;
const positionArray = new Float32Array(particleCount * 3); // Multiple of 3 due to x, y, z axes.

// Place 'particles' at random points in the background
for (let i = 0; i < particleCount*3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 5;
}
particleGeom.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

// Materials. These are the points making up the 'central object/geometry'
const material = new THREE.PointsMaterial({
    // transparent: true,
    // size: 0.007
    size: 0.020
});
// material.color = new THREE.Color(0xffffff);
material.color = new THREE.Color(0xfffaaa);

// These are the 'stars' in the background
const particleMaterial = new THREE.PointsMaterial({
    size: 0.004,
    // map: particleShape,
    transparent: true,
    color: 0x3c1d4e,
    blending: THREE.AdditiveBlending
})

// Mesh
const centralShape = new THREE.Points(geometry, material);
scene.add(centralShape);
const particlesMesh = new THREE.Points(particleGeom, particleMaterial);
scene.add(centralShape, particlesMesh);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#1c0a33'), 1);

// Mouse controls
document.addEventListener('mousemove', animateParticles);
let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

// Animation
const clock = new THREE.Clock();
const render = () => {
    const elapsedTime = clock.getElapsedTime();

    // FIXME: Decelerate particles on mouse stop
    // Update objects
    centralShape.rotation.y = 0.5 * elapsedTime;
    particlesMesh.rotation.y = -0.1 * elapsedTime;
    if (mouseX > 0) {
        particlesMesh.rotation.x  = -mouseY * (elapsedTime)*0.000008;
        particlesMesh.rotation.y  = -mouseX * (elapsedTime)*0.000008;
    }

    // Update Orbital Controls
    // controls.update()

    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
}

render();