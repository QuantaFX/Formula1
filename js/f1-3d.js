import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const container = document.getElementById("f1-canvas-container");
const canvas = document.getElementById("f1-canvas");

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
	alpha: true,
});
renderer.setSize(container.clientWidth * 0.8, container.clientHeight * 0.8);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const camera = new THREE.PerspectiveCamera(
	35,
	(container.clientWidth * 0.8) / (container.clientHeight * 0.8),
	0.01,
	100,
);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0.03, 0.03, 0.03);
controls.target.set(0, 0, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = -0.5;
controls.enableZoom = true;
controls.update();

// SETUP SCENE
const floorTexture = new THREE.TextureLoader().load("3d/grid.png");
floorTexture.repeat = new THREE.Vector2(50, 50);
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;

const scene = new THREE.Scene();

const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(0, 10, 0);
light.castShadow = true;
scene.add(light);

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: floorTexture,
	}),
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const hdriLoader = new RGBELoader();
hdriLoader.load("3d/lonely_road_afternoon_puresky_1k.hdr", function (texture) {
	texture.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = texture;
	scene.environment = texture;
});

const wheels = [];
let carBody = null;
let suspensionOffset = 0;

new GLTFLoader().load("3d/concept_ferrari.glb", (gltf) => {
	const mesh = gltf.scene;
	carBody = mesh;
	console.log("Full model:", mesh);

	console.log(mesh);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.traverse((child) => {
		if (child.isMesh) {
			console.log("  -> This is a MESH:", child.name); // Highlight actual meshes

			child.castShadow = true;
			child.receiveShadow = true;
			if (child.material) {
				child.material.envMapIntensity = 1;
			}

			const isWheel = [
				"Object_200",
				"Object_203",
				"Object_206",
				"Object_208",
				"Object_210",
				"Object_212",
				"Object_216",
				"Object_218",
				"Object_220",
				"Object_222",
				"Object_225",
				"Object_227",
				"Object_95",
				"Object_98",
				"Object_101",
				"Object_103",
				"Object_105",
				"Object_107",
				"Object_111",
				"Object_113",
				"Object_115",
				"Object_117",
				"Object_120",
				"Object_122",
				"Object_51",
				"Object_54",
				"Object_57",
				"Object_59",
				"Object_61",
				"Object_63",
				"Object_67",
				"Object_69",
				"Object_71",
				"Object_73",
				"Object_76",
				"Object_78",
				"Object_148",
				"Object_151",
				"Object_154",
				"Object_156",
				"Object_158",
				"Object_160",
				"Object_165",
				"Object167",
				"Object_169",
				"Object_171",
				"Object_173",
				"Object_175",
			].includes(child.name);

			child.userData.isWheel = isWheel;

			//RR Wheel Objects
			if (
				[
					"Object_200",
					"Object_203",
					"Object_206",
					"Object_208",
					"Object_210",
					"Object_212",
					"Object_216",
					"Object_218",
					"Object_220",
					"Object_222",
					"Object_225",
					"Object_227",
				].includes(child.name)
			) {
				const pivot = new THREE.Group();
				const wheelParent = child.parent;

				let pivotPosition;
				pivotPosition = new THREE.Vector3(0, -1.94, -0.3);

				wheelParent.add(pivot);
				pivot.position.copy(pivotPosition);

				wheelParent.remove(child);
				pivot.add(child);
				child.position.set(0, 1.9, 0.28);
				wheels.push(pivot);
			}

			//LR Wheel Objects
			if (
				[
					"Object_95",
					"Object_98",
					"Object_101",
					"Object_103",
					"Object_105",
					"Object_107",
					"Object_111",
					"Object_113",
					"Object_115",
					"Object_117",
					"Object_120",
					"Object_122",
				].includes(child.name)
			) {
				const pivot = new THREE.Group();
				const wheelParent = child.parent;

				let pivotPosition;
				pivotPosition = new THREE.Vector3(0, -1.94, -0.3);

				wheelParent.add(pivot);
				pivot.position.copy(pivotPosition);

				wheelParent.remove(child);
				pivot.add(child);
				child.position.set(0, 1.9, 0.28);
				wheels.push(pivot);
			}

			//RF Wheel Objects
			if (
				[
					"Object_51",
					"Object_54",
					"Object_57",
					"Object_59",
					"Object_61",
					"Object_63",
					"Object_67",
					"Object_69",
					"Object_71",
					"Object_73",
					"Object_76",
					"Object_78",
				].includes(child.name)
			) {
				const pivot = new THREE.Group();
				const wheelParent = child.parent;

				let pivotPosition;
				pivotPosition = new THREE.Vector3(0, 1.53, -0.45);

				wheelParent.add(pivot);
				pivot.position.copy(pivotPosition);

				wheelParent.remove(child);
				pivot.add(child);
				child.position.set(0, -1.56, 0.45);
				wheels.push(pivot);
			}

			//LF Wheel Objects
			if (
				[
					"Object_148",
					"Object_151",
					"Object_154",
					"Object_156",
					"Object_158",
					"Object_160",
					"Object_165",
					"Object167",
					"Object_169",
					"Object_171",
					"Object_173",
					"Object_175",
				].includes(child.name)
			) {
				const pivot = new THREE.Group();
				const wheelParent = child.parent;

				let pivotPosition;
				pivotPosition = new THREE.Vector3(0, 1.53, -0.45);

				wheelParent.add(pivot);
				pivot.position.copy(pivotPosition);

				wheelParent.remove(child);
				pivot.add(child);
				child.position.set(0, -1.56, 0.45);
				wheels.push(pivot);
			}
		}
	});
	scene.add(mesh);
});

const keys = { w: false, a: false, s: false, d: false };
const carFriction = 0.96;
let carVelocity = new THREE.Vector3(0, 0, 0);
const acceleration = 0.00001;
const maxVelocity = 0.001;

window.addEventListener("keydown", (e) => {
	const key = e.key.toLowerCase();
	if (key in keys) keys[key] = true;
});

window.addEventListener("keyup", (e) => {
	const key = e.key.toLowerCase();
	if (key in keys) keys[key] = false;
});

let isCarMoving = false;
let cameraLerpFactor = 0.5;

function animate() {
	requestAnimationFrame(animate);

	const rotationDamping = 1;
	let wheelRotationSpeed = 0;

	if (carBody) {
		suspensionOffset += 0.01;
		const suspensionAmount = Math.sin(suspensionOffset) * 0.02;

		if (keys.w) {
			carVelocity.z = Math.max(carVelocity.z + acceleration, maxVelocity);
			wheelRotationSpeed = 0.1;
		} else if (keys.s) {
			carVelocity.z = Math.min(carVelocity.z - acceleration, +maxVelocity);
			wheelRotationSpeed = -0.1;
		} else {
			carVelocity.z *= carFriction;
		}

		const wasCarMoving = isCarMoving;
		isCarMoving =
			Math.abs(carVelocity.x) > 0.0001 || Math.abs(carVelocity.z) > 0.0001;

		if (keys.a) {
			carVelocity.x = Math.max(carVelocity.x + acceleration, +maxVelocity);
		} else if (keys.d) {
			carVelocity.x = Math.min(carVelocity.x - acceleration, -maxVelocity);
		} else {
			carVelocity.x *= carFriction;
		}

		carBody.position.x += carVelocity.x;
		carBody.position.z += carVelocity.z;

		wheels.forEach((wheel) => {
			wheel.rotation.x += wheelRotationSpeed;
		});

		const cameraOffset = new THREE.Vector3(0, 0.015, -0.05);
		const lookAtOffset = new THREE.Vector3(0, 0.005, -0.01);

		if (isCarMoving) {
			cameraLerpFactor = 0.5;
			camera.position.lerp(
				carBody.position.clone().add(cameraOffset),
				cameraLerpFactor,
			);
			controls.target.lerp(
				carBody.position.clone().add(lookAtOffset),
				cameraLerpFactor,
			);
		} else if (wasCarMoving) {
			cameraLerpFactor = 0.1;
			camera.position.lerp(
				carBody.position.clone().add(cameraOffset),
				cameraLerpFactor,
			);
			controls.target.lerp(
				carBody.position.clone().add(lookAtOffset),
				cameraLerpFactor,
			);
		} else {
			cameraLerpFactor = 0.5;
			controls.autoRotate = true;
		}
	}

	renderer.render(scene, camera);
	controls.update();
}

window.addEventListener("resize", () => {
	camera.aspect =
		(container.clientWidth * 0.8) / (container.clientHeight * 0.8);
	camera.updateProjectionMatrix();
	renderer.setSize(container.clientWidth * 0.8, container.clientHeight * 0.8);
});

animate();
