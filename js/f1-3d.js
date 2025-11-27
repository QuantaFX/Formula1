import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const container = document.getElementById('f1-canvas-container');
const canvas = document.getElementById('f1-canvas');

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(container.clientWidth * 0.8, container.clientHeight * 0.8);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// SETUP CAMERA
const camera = new THREE.PerspectiveCamera(35, (container.clientWidth * 0.8) / (container.clientHeight * 0.8), 0.01, 100);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0.07, 0);
controls.target.set(0, 0, 0);
controls.autoRotate = false;
controls.autoRotateSpeed = 1;
controls.enableZoom = false; // Optional: disable zoom to keep the car size consistent
controls.update();

const scene = new THREE.Scene();

const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(0, 10, 0);
light.castShadow = true;
scene.add(light);

const hdriLoader = new RGBELoader()
hdriLoader.load('3d/lonely_road_afternoon_puresky_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

new GLTFLoader().load('3d/concept_ferrari.glb', (gltf) => {
    const mesh = gltf.scene;
    console.log(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.traverse((child) => {
        if (child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.envMapIntensity = 1;
        }
    });
    scene.add(mesh);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

window.addEventListener('resize', () => {
    // Resize camera aspect ratio and renderer size to the new window size
    camera.aspect = (container.clientWidth * 0.8) / (container.clientHeight * 0.8);
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth * 0.8, container.clientHeight * 0.8);
});

animate();