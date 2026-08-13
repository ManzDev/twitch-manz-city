import * as THREE from 'three';
import { createSidewalkTexture } from '../effects/textures.js';

const roadWidth = 5;
const sidewalkWidth = 1.5;
const roadMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 });
const sidewalkMat = new THREE.MeshStandardMaterial({ map: createSidewalkTexture(), roughness: 0.7, metalness: 0.05 });
const roadLineMat = new THREE.MeshStandardMaterial({ color: 0xdddd00 });

function createRoad(scene, x, z, length, direction) {
  const isX = direction === 'x';
  
  const roadGeo = new THREE.PlaneGeometry(
    isX ? length : roadWidth,
    isX ? roadWidth : length
  );
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(x, 0.02, z);
  road.receiveShadow = true;
  scene.add(road);

  const swGeo = new THREE.PlaneGeometry(
    isX ? length : sidewalkWidth,
    isX ? sidewalkWidth : length
  );
  
  const sw1 = new THREE.Mesh(swGeo, sidewalkMat);
  sw1.rotation.x = -Math.PI / 2;
  sw1.position.set(
    isX ? x : x + roadWidth / 2 + sidewalkWidth / 2,
    0.04,
    isX ? z + roadWidth / 2 + sidewalkWidth / 2 : z
  );
  sw1.receiveShadow = true;
  scene.add(sw1);

  const sw2 = new THREE.Mesh(swGeo, sidewalkMat);
  sw2.rotation.x = -Math.PI / 2;
  sw2.position.set(
    isX ? x : x - roadWidth / 2 - sidewalkWidth / 2,
    0.04,
    isX ? z - roadWidth / 2 - sidewalkWidth / 2 : z
  );
  sw2.receiveShadow = true;
  scene.add(sw2);

  for (let i = 0; i < Math.floor(length / 4); i++) {
    const markGeo = new THREE.PlaneGeometry(2, 0.15);
    const mark = new THREE.Mesh(markGeo, roadLineMat);
    mark.rotation.x = -Math.PI / 2;
    const offset = -length / 2 + i * 4 + 2;
    if (isX) {
      mark.position.set(x + offset, 0.03, z);
    } else {
      mark.rotation.z = Math.PI / 2;
      mark.position.set(x, 0.03, z + offset);
    }
    scene.add(mark);
  }
}

export function createRoads(scene, gridSize, spacing) {
  for (let i = -gridSize; i <= gridSize; i++) {
    const pos = i * spacing;
    createRoad(scene, 0, pos, spacing * gridSize * 2 + 10, 'x');
    createRoad(scene, pos, 0, spacing * gridSize * 2 + 10, 'z');
  }
}
