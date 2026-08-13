import * as THREE from 'three';
import { createBuildings, updateWindows } from './city/buildings.js';
import { createRoads } from './city/roads.js';
import { createCars, updateCars } from './city/cars.js';
import { createTrafficLights, updateTrafficLights } from './city/trafficLights.js';
import { initPeople, updatePeople } from './people/people.js';
import { createPig, updatePig } from './people/pig.js';
import { initCameraControls, updateCamera, state as cameraState } from './camera/camera.js';
import { updateDayNightCycle, updateWindowsIfNeeded } from './effects/daynight.js';
import { createGrassTexture, createSkyTexture } from './effects/textures.js';
import { initMusic, toggleMusic } from './effects/music.js';

document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyB') {
    initMusic();
    toggleMusic();
  }
});

const scene = new THREE.Scene();
const skyTexture = createSkyTexture();
scene.background = skyTexture;
scene.fog = new THREE.Fog(0x87ceeb, 80, 180);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 500);
camera.position.set(40, 35, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const controls = initCameraControls(camera, renderer);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff4e5, 2.0);
dirLight.position.set(50, 80, 30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(4096, 4096);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -80;
dirLight.shadow.camera.right = 80;
dirLight.shadow.camera.top = 80;
dirLight.shadow.camera.bottom = -80;
dirLight.shadow.bias = -0.0003;
dirLight.shadow.normalBias = 0.02;
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0x88bbff, 0x445522, 0.6);
scene.add(hemiLight);

const fillLight = new THREE.DirectionalLight(0xffeedd, 0.4);
fillLight.position.set(-30, 40, -20);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xaaccff, 0.3);
backLight.position.set(-20, 30, 50);
scene.add(backLight);

const groundGeo = new THREE.PlaneGeometry(150, 150);
const groundMat = new THREE.MeshStandardMaterial({
  map: createGrassTexture(),
  roughness: 0.85,
  metalness: 0.05
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const gridSize = 4;
const spacing = 24;

createRoads(scene, gridSize, spacing);
const buildings = createBuildings(scene, gridSize, spacing);
const cars = createCars(scene, gridSize, spacing);
createTrafficLights(scene, gridSize, spacing);
initPeople(scene);
const pig = createPig(scene);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const t = clock.getElapsedTime();

  updateDayNightCycle(scene, dirLight, ambientLight, hemiLight);
  updateWindowsIfNeeded(buildings, updateWindows);
  updateCars(cars, dt);
  updatePeople(dt, cars);
  if (!cameraState.pigPlayerMode) updatePig(pig, dt);
  updateTrafficLights(t);

  const pigCamActive = updateCamera(camera, controls, pig);
  if (!pigCamActive) renderer.render(scene, camera);
  else renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
