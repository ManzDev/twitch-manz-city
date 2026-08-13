import * as THREE from 'three';

const PINK = 0xffaaaa;
const DARK_PINK = 0xcc8888;

export function createPig(scene) {
  const group = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(0.6, 0.45, 0.4);
  const bodyMat = new THREE.MeshStandardMaterial({ color: PINK, roughness: 0.7 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.5;
  body.castShadow = true;
  group.add(body);

  const headGeo = new THREE.BoxGeometry(0.3, 0.25, 0.3);
  const headMat = new THREE.MeshStandardMaterial({ color: PINK, roughness: 0.6 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0.35, 0.6, 0);
  head.castShadow = true;
  group.add(head);

  const noseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8);
  const noseMat = new THREE.MeshStandardMaterial({ color: DARK_PINK });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.rotation.z = Math.PI / 2;
  nose.position.set(0.52, 0.58, 0);
  group.add(nose);

  const nostrilGeo = new THREE.SphereGeometry(0.02, 6, 6);
  const nostrilMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const nostrilL = new THREE.Mesh(nostrilGeo, nostrilMat);
  nostrilL.position.set(0.55, 0.6, 0.03);
  group.add(nostrilL);
  const nostrilR = new THREE.Mesh(nostrilGeo, nostrilMat);
  nostrilR.position.set(0.55, 0.6, -0.03);
  group.add(nostrilR);

  const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(0.42, 0.68, 0.12);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.42, 0.68, -0.12);
  group.add(eyeR);

  const earGeo = new THREE.BoxGeometry(0.08, 0.12, 0.06);
  const earMat = new THREE.MeshStandardMaterial({ color: DARK_PINK });
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(0.3, 0.8, 0.12);
  earL.rotation.z = 0.3;
  group.add(earL);
  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.3, 0.8, -0.12);
  earR.rotation.z = -0.3;
  group.add(earR);

  const legGeo = new THREE.BoxGeometry(0.1, 0.3, 0.1);
  const legMat = new THREE.MeshStandardMaterial({ color: PINK });
  const legFL = new THREE.Mesh(legGeo, legMat);
  legFL.position.set(0.2, 0.15, 0.12);
  group.add(legFL);
  const legFR = new THREE.Mesh(legGeo, legMat);
  legFR.position.set(0.2, 0.15, -0.12);
  group.add(legFR);
  const legBL = new THREE.Mesh(legGeo, legMat);
  legBL.position.set(-0.2, 0.15, 0.12);
  group.add(legBL);
  const legBR = new THREE.Mesh(legGeo, legMat);
  legBR.position.set(-0.2, 0.15, -0.12);
  group.add(legBR);

  const tailGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 8, Math.PI * 1.5);
  const tailMat = new THREE.MeshStandardMaterial({ color: DARK_PINK });
  const tail = new THREE.Mesh(tailGeo, tailMat);
  tail.position.set(-0.35, 0.6, 0);
  tail.rotation.y = Math.PI / 2;
  group.add(tail);

  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.beginPath();
  ctx.moveTo(76, 24); ctx.lineTo(248, 24); ctx.quadraticCurveTo(256, 24, 256, 32);
  ctx.lineTo(256, 56); ctx.quadraticCurveTo(256, 64, 248, 64);
  ctx.lineTo(76, 64); ctx.quadraticCurveTo(68, 64, 68, 56);
  ctx.lineTo(68, 32); ctx.quadraticCurveTo(68, 24, 76, 24);
  ctx.closePath(); ctx.fill();
  ctx.font = 'bold 24px monospace'; ctx.fillStyle = '#ffaaaa';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('DHardySD', 80, 44);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.position.y = 1.3; sprite.scale.set(2.5, 1.25, 1);
  group.add(sprite);

  const originX = (Math.random() - 0.5) * 60;
  const originZ = (Math.random() - 0.5) * 60;
  group.position.set(originX, 0, originZ);

  const direction = Math.random() > 0.5 ? 'x' : 'z';
  const speed = 0.15 + Math.random() * 0.2;

  scene.add(group);

  return {
    mesh: group,
    username: 'DHardySD',
    direction,
    speed,
    origin: new THREE.Vector3(originX, 0, originZ),
    time: 0,
    legPhase: Math.random() * Math.PI * 2
  };
}

export function updatePig(pig, dt) {
  pig.time += dt * pig.speed;

  if (pig.direction === 'x') {
    pig.mesh.position.x = pig.origin.x + pig.time * pig.speed * 2;
    pig.mesh.position.z = pig.origin.z;
  } else {
    pig.mesh.position.z = pig.origin.z + pig.time * pig.speed * 2;
    pig.mesh.position.x = pig.origin.x;
  }

  pig.mesh.rotation.y = pig.direction === 'x' ? Math.PI / 2 : 0;

  pig.legPhase += dt * pig.speed * 4;
  const legAngle = Math.sin(pig.legPhase) * 0.4;
  const legFL = pig.mesh.children[5];
  const legFR = pig.mesh.children[6];
  const legBL = pig.mesh.children[7];
  const legBR = pig.mesh.children[8];
  if (legFL) legFL.rotation.x = legAngle;
  if (legFR) legFR.rotation.x = -legAngle;
  if (legBL) legBL.rotation.x = -legAngle;
  if (legBR) legBR.rotation.x = legAngle;

  if (pig.mesh.position.x > 55 || pig.mesh.position.x < -55 ||
      pig.mesh.position.z > 55 || pig.mesh.position.z < -55) {
    pig.origin.set((Math.random() - 0.5) * 60, 0, (Math.random() - 0.5) * 60);
    pig.time = 0;
  }
}
