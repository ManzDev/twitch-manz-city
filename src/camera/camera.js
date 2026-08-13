import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const state = {
  cameraTarget: new THREE.Vector3(40, 35, 40),
  isTransitioning: false,
  pigCamMode: false,
  pigPlayerMode: false
};

const keys = { forward: false, backward: false, turnLeft: false, turnRight: false };

export function initCameraControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.minDistance = 15;
  controls.maxDistance = 120;

  function randomCameraPosition() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 25 + Math.random() * 50;
    const height = 10 + Math.random() * 30;
    return new THREE.Vector3(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!state.pigPlayerMode) {
        state.cameraTarget.copy(randomCameraPosition());
        state.isTransitioning = true;
      }
    }
    if (e.code === 'KeyD') {
      if (state.pigPlayerMode) return;
      state.pigCamMode = !state.pigCamMode;
      controls.enabled = !state.pigCamMode;
      document.getElementById('gopro').style.display = state.pigCamMode ? 'block' : 'none';
      if (!state.pigCamMode) {
        state.isTransitioning = true;
        state.cameraTarget.copy(randomCameraPosition());
      }
    }
    if (e.code === 'KeyP') {
      state.pigPlayerMode = !state.pigPlayerMode;
      state.pigCamMode = false;
      controls.enabled = !state.pigPlayerMode;
      document.getElementById('gopro').style.display = 'none';
      if (!state.pigPlayerMode) {
        state.isTransitioning = true;
        state.cameraTarget.copy(randomCameraPosition());
      }
    }
    if (state.pigPlayerMode) {
      if (e.code === 'ArrowUp') keys.forward = true;
      if (e.code === 'ArrowDown') keys.backward = true;
      if (e.code === 'ArrowLeft') keys.turnLeft = true;
      if (e.code === 'ArrowRight') keys.turnRight = true;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') keys.forward = false;
    if (e.code === 'ArrowDown') keys.backward = false;
    if (e.code === 'ArrowLeft') keys.turnLeft = false;
    if (e.code === 'ArrowRight') keys.turnRight = false;
  });

  return controls;
}

export function updateCamera(camera, controls, pig) {
  if (state.pigPlayerMode) {
    const turnSpeed = 2.5;
    const moveSpeed = 8;

    if (keys.turnLeft) pig.mesh.rotation.y += turnSpeed * (1 / 60);
    if (keys.turnRight) pig.mesh.rotation.y -= turnSpeed * (1 / 60);

    const dir = pig.mesh.rotation.y;
    const forwardX = Math.sin(dir);
    const forwardZ = Math.cos(dir);
    let dx = 0, dz = 0;
    if (keys.forward) { dx += forwardX; dz += forwardZ; }
    if (keys.backward) { dx -= forwardX; dz -= forwardZ; }

    if (dx !== 0 || dz !== 0) {
      const len = Math.sqrt(dx * dx + dz * dz);
      pig.mesh.position.x += (dx / len) * moveSpeed * (1 / 60);
      pig.mesh.position.z += (dz / len) * moveSpeed * (1 / 60);
      pig.mesh.position.x = Math.max(-70, Math.min(70, pig.mesh.position.x));
      pig.mesh.position.z = Math.max(-70, Math.min(70, pig.mesh.position.z));
    }

    const eyeX = pig.mesh.position.x + forwardX * 0.5;
    const eyeZ = pig.mesh.position.z + forwardZ * 0.5;
    camera.position.set(eyeX, 0.6, eyeZ);
    camera.lookAt(
      pig.mesh.position.x + forwardX * 20,
      0.6,
      pig.mesh.position.z + forwardZ * 20
    );
    controls.update();
    return true;
  }

  if (state.pigCamMode) {
    const pigPos = pig.mesh.position;
    const dir = pig.mesh.rotation.y;
    const frontX = Math.sin(dir);
    const frontZ = Math.cos(dir);
    camera.position.set(pigPos.x + frontX * 4, 1.5, pigPos.z + frontZ * 4);
    camera.lookAt(pigPos.x + frontX * 0.5, 0.5, pigPos.z + frontZ * 0.5);
    const now = new Date();
    document.getElementById('gopro-time').textContent =
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    controls.update();
    return true;
  }

  if (state.isTransitioning) {
    camera.position.lerp(state.cameraTarget, 0.03);
    if (camera.position.distanceTo(state.cameraTarget) < 0.5) {
      state.isTransitioning = false;
    }
  }
  controls.update();
  return false;
}

export function isPlayerMoving() {
  return state.pigPlayerMode && (keys.forward || keys.backward || keys.turnLeft || keys.turnRight);
}
