import * as THREE from 'three';

export function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2a5228';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const h = 3 + Math.random() * 6;
    const light = Math.random() > 0.5;
    ctx.strokeStyle = light ? '#3a7035' : '#1e4018';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y - h);
    ctx.stroke();
  }

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = `rgba(${40 + Math.random() * 30}, ${70 + Math.random() * 30}, ${30 + Math.random() * 15}, 0.3)`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  return texture;
}

export function createSidewalkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 256; i += 64) {
    for (let j = 0; j < 256; j += 64) {
      const shade = 170 + Math.random() * 20;
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(i + 1, j + 1, 62, 62);
    }
  }

  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
  }

  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = `rgba(${140 + Math.random() * 30}, ${140 + Math.random() * 30}, ${140 + Math.random() * 30}, 0.4)`;
    ctx.beginPath();
    ctx.arc(x, y, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createSkyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1a3a6a');
  gradient.addColorStop(0.3, '#4a8ad4');
  gradient.addColorStop(0.6, '#7ab8f0');
  gradient.addColorStop(0.85, '#b0daf5');
  gradient.addColorStop(1, '#d8ecf8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  function drawCloud(cx, cy, w, h) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 8; i++) {
      const x = cx + (Math.random() - 0.5) * w;
      const y = cy + (Math.random() - 0.5) * h;
      const r = 15 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 12; i++) {
    drawCloud(
      100 + Math.random() * 824,
      30 + Math.random() * 200,
      80 + Math.random() * 120,
      20 + Math.random() * 30
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}
