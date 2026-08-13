import * as THREE from 'three';

const shirtColors = [
  0x4466aa, 0x6688cc, 0xaa5555, 0x88aa55, 0xcc8844,
  0x7766aa, 0x5588aa, 0x999999, 0xbbbb88, 0xff6688,
  0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff
];
const pantsColors = [0x222244, 0x333333, 0x1a1a2e, 0x445566, 0x2d2d2d];
const hairColors = [0x1a1a1a, 0x4a3728, 0x8b6914, 0xcc8844, 0x888888, 0xaa4400];
const skinColors = [0xffdab9, 0xe8b896, 0xc68642, 0x8d5524, 0xffdbac];
const accessoryList = ['none', 'cap', 'tophat', 'sunglasses', 'glasses', 'parrot', 'afro', 'longhair', 'mohawk', 'beanie'];

export { shirtColors };
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function addHair(group, accessory, hairColor) {
  if (accessory === 'afro') {
    const afro = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 }));
    afro.position.y = 2.0; afro.scale.set(1, 0.8, 1); group.add(afro);
  } else if (accessory === 'longhair') {
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.3), hairMat);
    hair.position.set(0, 1.9, -0.15); group.add(hair);
    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.15), hairMat);
    hairBack.position.set(0, 1.5, -0.2); group.add(hairBack);
  } else if (accessory === 'mohawk') {
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    for (let i = 0; i < 5; i++) {
      const spike = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.15), spikeMat);
      spike.position.set(0, 2.0 + i * 0.05, -0.1 + i * 0.02);
      spike.rotation.x = -0.2; group.add(spike);
    }
  } else if (!['cap', 'tophat', 'beanie', 'none'].includes(accessory)) {
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 }));
    hair.position.y = 1.85; hair.scale.set(1, 0.6, 1); group.add(hair);
  }
}

function addHat(group, accessory) {
  if (accessory === 'cap') {
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.15, 12), capMat);
    cap.position.y = 2.05; group.add(cap);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.2), capMat);
    brim.position.set(0, 2.0, 0.2); group.add(brim);
  } else if (accessory === 'tophat') {
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 12), hatMat);
    hatBase.position.y = 2.0; group.add(hatBase);
    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.35, 12), hatMat);
    hatTop.position.y = 2.2; group.add(hatTop);
  } else if (accessory === 'beanie') {
    const beanie = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    beanie.position.y = 1.85; group.add(beanie);
  }
}

function addGlasses(group, accessory) {
  if (accessory !== 'sunglasses' && accessory !== 'glasses') return;
  const glassColor = accessory === 'sunglasses' ? 0x111111 : 0x88ccff;
  const glassMat = new THREE.MeshStandardMaterial({ color: glassColor, transparent: true, opacity: 0.8 });
  const lensGeo = new THREE.BoxGeometry(0.12, 0.08, 0.05);
  const leftLens = new THREE.Mesh(lensGeo, glassMat); leftLens.position.set(-0.1, 1.78, 0.22); group.add(leftLens);
  const rightLens = new THREE.Mesh(lensGeo, glassMat); rightLens.position.set(0.1, 1.78, 0.22); group.add(rightLens);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  frame.position.set(0, 1.78, 0.23); group.add(frame);
}

function addParrot(group) {
  const pg = new THREE.Group();
  pg.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0x00aa00 })));
  const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0x00cc00 }));
  pHead.position.set(0.1, 0.08, 0); pg.add(pHead);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
  beak.position.set(0.18, 0.08, 0); beak.rotation.z = -Math.PI / 2; pg.add(beak);
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x0066ff });
  const wL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.1), wingMat); wL.position.set(0, 0.05, -0.1); pg.add(wL);
  const wR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.1), wingMat); wR.position.set(0, 0.05, 0.1); pg.add(wR);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.15), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
  tail.position.set(-0.12, 0, 0); pg.add(tail);
  pg.position.set(-0.5, 1.45, 0); pg.rotation.z = 0.3; group.add(pg);
}

function addLabel(group, username, userInfo) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const avatarImg = new Image(); avatarImg.crossOrigin = 'anonymous';
  let avatarUrl = null;
  if (userInfo && userInfo.avatar) {
    userInfo.avatar.then(url => { avatarUrl = url; avatarImg.src = url; });
  } else {
    avatarImg.src = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ebe4cd89-b4f4-4cd9-adac-2f30151b4209-profile_image-70x70.png';
  }
  const drawLabel = (img) => {
    ctx.clearRect(0, 0, 256, 128);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(40, 40, 28, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(img, 12, 12, 56, 56); ctx.restore();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.beginPath();
    ctx.moveTo(76, 24); ctx.lineTo(248, 24); ctx.quadraticCurveTo(256, 24, 256, 32);
    ctx.lineTo(256, 56); ctx.quadraticCurveTo(256, 64, 248, 64);
    ctx.lineTo(76, 64); ctx.quadraticCurveTo(68, 64, 68, 56);
    ctx.lineTo(68, 32); ctx.quadraticCurveTo(68, 24, 76, 24);
    ctx.closePath(); ctx.fill();
    ctx.font = 'bold 24px monospace'; ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(username.substring(0, 12), 80, 44);
    texture.needsUpdate = true;
  };
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.position.y = 2.8; sprite.scale.set(3, 1.5, 1); group.add(sprite);
  avatarImg.onload = () => drawLabel(avatarImg);
  avatarImg.onerror = () => drawLabel(null);
  drawLabel(null);
  return avatarUrl;
}

export function createPerson(scene, username, userInfo, people) {
  console.log(`[CREATE] Creando personaje para ${username}`);
  const group = new THREE.Group();
  const skinColor = pick(skinColors);
  const shirtColor = pick(shirtColors);
  const pantsColor = pick(pantsColors);
  const hairColor = pick(hairColors);
  const accessory = pick(accessoryList);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.4), new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 }));
  torso.position.y = 1.1; torso.castShadow = true; group.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 }));
  head.position.y = 1.75; head.castShadow = true; group.add(head);
  const armMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), armMat);
  leftArm.position.set(-0.45, 1.0, 0); leftArm.castShadow = true; group.add(leftArm);
  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), armMat);
  rightArm.position.set(0.45, 1.0, 0); rightArm.castShadow = true; group.add(rightArm);

  const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, 0.2), legMat);
  leftLeg.position.set(-0.15, 0.5, 0); leftLeg.castShadow = true; group.add(leftLeg);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, 0.2), legMat);
  rightLeg.position.set(0.15, 0.5, 0); rightLeg.castShadow = true; group.add(rightLeg);

  const footMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.25), footMat);
  leftFoot.position.set(-0.15, 0.2, 0.05); group.add(leftFoot);
  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.25), footMat);
  rightFoot.position.set(0.15, 0.2, 0.05); group.add(rightFoot);
  addHair(group, accessory, hairColor);
  addHat(group, accessory);
  addGlasses(group, accessory);
  if (accessory === 'parrot') addParrot(group);

  const originX = (Math.random() - 0.5) * 80;
  const originZ = (Math.random() - 0.5) * 80;
  group.position.set(originX, 0, originZ);
  const direction = Math.random() > 0.5 ? 'x' : 'z';
  const speed = 0.2 + Math.random() * 0.8;
  scene.add(group);
  console.log(`[CREATE] ${username} (${accessory}) en (${originX.toFixed(1)}, 0, ${originZ.toFixed(1)})`);

  const person = {
    mesh: group, username, direction, speed,
    origin: new THREE.Vector3(originX, 0, originZ),
    time: 0, legPhase: Math.random() * Math.PI * 2,
    armPhase: Math.random() * Math.PI * 2,
    dead: false, deathTime: 0, avatarUrl: null, scene
  };
  const avatarUrl = addLabel(group, username, userInfo);
  if (userInfo && userInfo.avatar) userInfo.avatar.then(url => { person.avatarUrl = url; });
  people.push(person);
  return person;
}
