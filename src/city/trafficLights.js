import * as THREE from 'three';

const trafficLights = [];

function createTrafficLight(scene, x, z) {
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 4.5, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(x, 2.25, z);
  pole.castShadow = true;
  scene.add(pole);

  const armGeo = new THREE.BoxGeometry(0.08, 0.08, 1.2);
  const arm = new THREE.Mesh(armGeo, poleMat);
  arm.position.set(x, 4.2, z + 0.6);
  scene.add(arm);

  const boxGeo = new THREE.BoxGeometry(0.6, 1.5, 0.5);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4 });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.set(x, 4.2, z + 1.2);
  scene.add(box);

  const lightGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const colors = [0xff0000, 0xffaa00, 0x00ff00];

  for (let i = 0; i < 3; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: i === 0 ? 3 : 0.1,
      roughness: 0.2,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(lightGeo, mat);
    mesh.position.set(x, 4.65 - i * 0.45, z + 1.48);
    mesh.userData = { state: i };
    scene.add(mesh);

    const pointLight = new THREE.PointLight(colors[i], 0, 8);
    pointLight.position.copy(mesh.position);
    scene.add(pointLight);

    trafficLights.push({ mesh, pointLight });
  }
}

export function createTrafficLights(scene, gridSize, spacing) {
  const positions = [];
  for (let i = -gridSize + 1; i < gridSize; i += 2) {
    for (let j = -gridSize + 1; j < gridSize; j += 2) {
      positions.push([i * spacing + 3, j * spacing + 3]);
      positions.push([i * spacing - 3, j * spacing - 3]);
    }
  }
  positions.forEach(([x, z]) => createTrafficLight(scene, x, z));
}

export function updateTrafficLights(t) {
  const tlCycle = Math.floor(t / 4) % 3;
  for (const tl of trafficLights) {
    const isActive = tl.mesh.userData.state === tlCycle;
    tl.mesh.material.emissiveIntensity = isActive ? 4 : 0.05;
    tl.pointLight.intensity = isActive ? 2 : 0;
  }
}
