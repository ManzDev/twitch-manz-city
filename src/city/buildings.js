import * as THREE from 'three';

const buildingColors = [
  0x8b9dc3, 0xb0c4de, 0x778899, 0xa9a9a9, 0xc0c0c0,
  0xd2b48c, 0xbc8f8f, 0xf5deb3, 0xdeb887, 0xc4a484
];
const buildingMeshes = [];
const windowMeshes = [];
const senoraInstances = [];

function createSenoraTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff00';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#f0b090';
  ctx.beginPath();
  ctx.arc(64, 70, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cc3333';
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
    const cx = 64 + Math.cos(angle) * 26;
    const cy = 50 + Math.sin(angle) * 18;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(54, 66, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(74, 66, 4, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#aa2222';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(64, 80, 10, 0.3, Math.PI - 0.3);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const senoraTexture = createSenoraTexture();

function createBuilding(scene, x, z, w, d, h) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.15
  });
  const building = new THREE.Mesh(geo, mat);
  building.position.set(x, h / 2, z);
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);

  const roofShape = new THREE.Shape();
  roofShape.moveTo(-w * 0.35, 0);
  roofShape.lineTo(w * 0.35, 0);
  roofShape.lineTo(0, h * 0.2);
  roofShape.lineTo(-w * 0.35, 0);

  const roofExtrudeSettings = {
    depth: d * 0.7,
    bevelEnabled: false
  };
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings);
  const roofMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).offsetHSL(0.02, -0.1, -0.15),
    roughness: 0.8
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(x, h + h * 0.02, z - d * 0.35);
  roof.castShadow = true;
  scene.add(roof);

  const windowGeo = new THREE.BoxGeometry(0.35, 0.45, 0.08);

  for (let wy = 1.5; wy < h - 1; wy += 2) {
    for (let wx = -w / 2 + 0.8; wx < w / 2; wx += 1.2) {
      const isLit = Math.random() > 0.35;
      const windowMat = new THREE.MeshStandardMaterial({
        color: isLit ? 0xfff8dc : 0x2a2a3a,
        emissive: isLit ? 0xffee88 : 0x000000,
        emissiveIntensity: isLit ? 0.6 : 0,
        roughness: 0.2,
        metalness: 0.3
      });

      const win = new THREE.Mesh(windowGeo, windowMat);
      win.position.set(x + wx, wy, z + d / 2 + 0.04);
      scene.add(win);
      windowMeshes.push(win);

      if (isLit && Math.random() < 0.02) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: senoraTexture }));
        sprite.scale.set(0.5, 0.5, 1);
        sprite.position.set(x + wx, wy, z + d / 2 + 0.15);
        scene.add(sprite);
        senoraInstances.push({ sprite, window: win });
      }

      const win2 = new THREE.Mesh(windowGeo, windowMat.clone());
      win2.position.set(x + wx, wy, z - d / 2 - 0.04);
      scene.add(win2);
      windowMeshes.push(win2);
    }
  }

  buildingMeshes.push({ mesh: building, x, z, w, d, h });
}

export function createBuildings(scene, gridSize, spacing) {
  for (let bx = -gridSize + 0.5; bx < gridSize - 0.5; bx++) {
    for (let bz = -gridSize + 0.5; bz < gridSize - 0.5; bz++) {
      const cx = bx * spacing;
      const cz = bz * spacing;
      const numBuildings = 2 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBuildings; b++) {
        const w = 3 + Math.random() * 3;
        const d = 3 + Math.random() * 3;
        const h = 5 + Math.random() * 15;
        const ox = (Math.random() - 0.5) * (spacing - w - 3);
        const oz = (Math.random() - 0.5) * (spacing - d - 3);
        createBuilding(scene, cx + ox, cz + oz, w, d, h);
      }
    }
  }
  return buildingMeshes;
}

export function updateWindows(buildings) {
  windowMeshes.forEach(win => {
    if (Math.random() < 0.03) {
      const isOn = win.material.emissiveIntensity < 0.1;
      win.material.emissiveIntensity = isOn ? 0.6 : 0;
      win.material.emissive.setHex(isOn ? 0xffee88 : 0x000000);
      win.material.color.setHex(isOn ? 0xfff8dc : 0x2a2a3a);
    }
  });
  for (const s of senoraInstances) {
    s.sprite.visible = s.window.material.emissiveIntensity > 0.1;
  }
}
