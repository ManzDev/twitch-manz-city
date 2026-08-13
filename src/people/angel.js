import * as THREE from 'three';

const haloGeo = new THREE.TorusGeometry(0.35, 0.06, 8, 24);
const haloMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffaa00, emissiveIntensity: 2, metalness: 0.8 });
const wingGeo = new THREE.PlaneGeometry(0.6, 0.8);
const wingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });

export function createAngel(scene, position, username, avatarUrl) {
  const group = new THREE.Group();
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x444444 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.4), whiteMat);
  body.position.set(0, 1.0, 0); group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), whiteMat);
  head.position.set(0, 1.65, 0); group.add(head);

  const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), legMat); l1.position.set(0.12, 0.5, 0); group.add(l1);
  const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), legMat); l2.position.set(-0.12, 0.5, 0); group.add(l2);

  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const avatarImg = new Image(); avatarImg.crossOrigin = 'anonymous';
  if (avatarUrl) avatarImg.src = avatarUrl;
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
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  label.position.set(0, 2.5, 0); label.scale.set(3, 1.5, 1); group.add(label);
  avatarImg.onload = () => drawLabel(avatarImg); avatarImg.onerror = () => drawLabel(null); drawLabel(null);

  const halo = new THREE.Mesh(haloGeo, haloMat.clone()); halo.position.set(0, 2.1, 0); group.add(halo);
  const wL = new THREE.Mesh(wingGeo, wingMat.clone()); wL.position.set(-0.4, 1.2, 0); wL.rotation.z = 0.3; group.add(wL);
  const wR = new THREE.Mesh(wingGeo, wingMat.clone()); wR.position.set(0.4, 1.2, 0); wR.rotation.z = -0.3; group.add(wR);

  group.position.copy(position);
  scene.add(group);
  return { mesh: group, startTime: performance.now() / 1000, username };
}

export function updateAngels(angels, t) {
  for (const angel of angels) {
    const elapsed = t - angel.startTime;
    if (elapsed > 3) { angel.mesh.visible = false; continue; }
    const fade = 1 - elapsed / 3;
    angel.mesh.traverse(o => { if (o.material && o.material.opacity !== undefined) o.material.opacity = fade; });
    angel.mesh.position.y = elapsed * 3;
    angel.mesh.rotation.z = Math.sin(elapsed * 2) * 0.2;
    const wingAngle = Math.sin(elapsed * 5) * 0.3;
    if (angel.mesh.children[5]) angel.mesh.children[5].rotation.z = 0.3 + wingAngle;
    if (angel.mesh.children[6]) angel.mesh.children[6].rotation.z = -0.3 - wingAngle;
    if (angel.mesh.children[4]) { angel.mesh.children[4].rotation.z = elapsed * 2; angel.mesh.children[4].rotation.x = elapsed * 1.5; }
  }
  for (let i = angels.length - 1; i >= 0; i--) {
    if (!angels[i].mesh.visible) { angels[i].mesh.parent.remove(angels[i].mesh); angels.splice(i, 1); }
  }
}
