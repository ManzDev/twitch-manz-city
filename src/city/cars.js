import * as THREE from 'three';

const carColors = [
  0xcc0000, 0x0044cc, 0xcccc00, 0x00aa44, 0xff6600,
  0xeeeeee, 0x6600cc, 0xff4488, 0x333333, 0x0066cc
];

function createCar(scene, color, direction) {
  const group = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(2.2, 0.7, 1.1);
  const bodyMat = new THREE.MeshStandardMaterial({ 
    color, 
    metalness: 0.7, 
    roughness: 0.25 
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.45;
  body.castShadow = true;
  group.add(body);

  const cabinGeo = new THREE.BoxGeometry(1.1, 0.5, 0.95);
  const cabinMat = new THREE.MeshStandardMaterial({ 
    color: 0x88bbdd, 
    metalness: 0.9, 
    roughness: 0.1,
    transparent: true,
    opacity: 0.7
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.15, 0.95, 0);
  group.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
  const rimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.19, 8);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });
  
  for (const [wx, wz] of [[0.65, 0.4], [-0.65, 0.4], [0.65, -0.4], [-0.65, -0.4]]) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(wx, 0.22, wz);
    wheel.rotation.z = Math.PI / 2;
    group.add(wheel);
    
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.set(wx, 0.22, wz);
    rim.rotation.z = Math.PI / 2;
    group.add(rim);
  }

  const headlightGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const headlightMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    emissive: 0xffffcc, 
    emissiveIntensity: 1.5 
  });
  const hl1 = new THREE.Mesh(headlightGeo, headlightMat);
  hl1.position.set(direction === 'x' ? 1.1 : 0, 0.4, 0.4);
  group.add(hl1);
  const hl2 = new THREE.Mesh(headlightGeo, headlightMat);
  hl2.position.set(direction === 'x' ? 1.1 : 0, 0.4, -0.4);
  group.add(hl2);

  const taillightGeo = new THREE.SphereGeometry(0.08, 6, 6);
  const taillightMat = new THREE.MeshStandardMaterial({ 
    color: 0xff0000, 
    emissive: 0xff0000, 
    emissiveIntensity: 0.8 
  });
  const tl1 = new THREE.Mesh(taillightGeo, taillightMat);
  tl1.position.set(direction === 'x' ? -1.1 : 0, 0.4, 0.4);
  group.add(tl1);
  const tl2 = new THREE.Mesh(taillightGeo, taillightMat);
  tl2.position.set(direction === 'x' ? -1.1 : 0, 0.4, -0.4);
  group.add(tl2);

  scene.add(group);

  const speed = 4 + Math.random() * 5;
  const laneOffset = direction === 'x' ? (Math.random() > 0.5 ? 1.2 : -1.2) : (Math.random() > 0.5 ? 1.2 : -1.2);
  const startOffset = Math.random() * 140 - 70;

  if (direction === 'x') {
    group.position.set(startOffset, 0, laneOffset);
    group.userData = { direction: 'x', speed };
  } else {
    group.position.set(laneOffset, 0, startOffset);
    group.userData = { direction: 'z', speed };
    group.rotation.y = Math.PI / 2;
  }

  return group;
}

export function createCars(scene, gridSize, spacing) {
  const cars = [];
  for (let i = 0; i < 25; i++) {
    const car = createCar(scene, carColors[i % carColors.length], i % 2 === 0 ? 'x' : 'z');
    cars.push(car);
  }
  return cars;
}

export function updateCars(cars, dt) {
  for (const car of cars) {
    const ud = car.userData;
    if (ud.direction === 'x') {
      car.position.x += ud.speed * dt;
      if (car.position.x > 75) car.position.x = -75;
      if (car.position.x < -75) car.position.x = 75;
    } else {
      car.position.z += ud.speed * dt;
      if (car.position.z > 75) car.position.z = -75;
      if (car.position.z < -75) car.position.z = 75;
    }
  }
}
