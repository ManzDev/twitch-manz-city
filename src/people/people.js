import * as THREE from 'three';
import { client } from 'mtmi';
import { createPerson, shirtColors, pick } from './person.js';
import { createAngel, updateAngels } from './angel.js';

const people = [];
const angels = [];
let speechMuted = false;
const params = new URLSearchParams(window.location.search);
const CHANNEL = (params.get('channel') || 'manzdev').toLowerCase();

document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM') {
    speechMuted = !speechMuted;
    if (speechMuted) speechSynthesis.cancel();
  }
});

function createBubble(person, message) {
  if (person.bubble) {
    person.mesh.remove(person.bubble.mesh);
    person.bubble.mesh.material.map.dispose();
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.font = '22px monospace';

  const lines = [];
  const words = message.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > 440) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
    if (lines.length >= 4) break;
  }
  if (line && lines.length < 5) lines.push(line);

  const lineHeight = 28;
  const textHeight = lines.length * lineHeight;
  const padY = 20;
  const bubbleH = textHeight + padY * 2;
  const bubbleY = 30;

  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.roundRect(16, bubbleY, 480, bubbleH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(240, bubbleY + bubbleH);
  ctx.lineTo(250, bubbleY + bubbleH + 14);
  ctx.lineTo(260, bubbleY + bubbleH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 256, bubbleY + padY + i * lineHeight);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.position.y = 3.8;
  sprite.scale.set(4, 2, 1);
  person.mesh.add(sprite);

  const timeout = Math.min(15, 5 + Math.ceil(message.length / 10));
  person.bubble = { mesh: sprite, expiry: performance.now() / 1000 + timeout };
}

export function initPeople(scene) {
  console.log(`[MTMI] Iniciando conexion a #${CHANNEL}...`);
  client.on('connected', () => console.log('[MTMI] Conectado al IRC de Twitch'));
  client.on('join', ({ username, channel }) => {
    if (channel === CHANNEL || channel === '#' + CHANNEL) {
      if (!people.find(p => p.username === username)) createPerson(scene, username, null, people);
    }
  });
  client.on('message', ({ username, channel, userInfo, message }) => {
    if (channel === CHANNEL || channel === '#' + CHANNEL) {
      const person = people.find(p => p.username === username);
      if (person) {
        createBubble(person, message);
        if (!speechMuted) {
          const utter = new SpeechSynthesisUtterance(message);
          utter.lang = 'es-ES';
          utter.rate = 1.1;
          speechSynthesis.speak(utter);
        }
      } else {
        createPerson(scene, username, userInfo, people);
      }
    }
  });
  client.connect({ channels: [CHANNEL], avatarProvider: 'ivr' });
}

function respawnPerson(person) {
  const originX = (Math.random() - 0.5) * 80;
  const originZ = (Math.random() - 0.5) * 80;
  person.origin.set(originX, 0, originZ);
  person.time = 0; person.dead = false; person.mesh.visible = true;
  person.mesh.position.set(originX, 0, originZ);
  person.mesh.rotation.x = 0; person.mesh.position.y = 0;
  person.mesh.children.forEach((c, i) => {
    if (i < 2) { c.material.color.set(pick(shirtColors)); c.material.emissive.set(0x000000); }
    if (i >= 4 && i <= 7) c.visible = true;
  });
}

export function updatePeople(dt, cars) {
  const t = performance.now() / 1000;

  for (const car of cars) {
    for (const person of people) {
      if (person.dead) continue;
      if (car.position.distanceTo(person.mesh.position) < 2.5) {
        person.dead = true;
        person.deathTime = t;
        person.mesh.children.forEach((c, i) => { if (i >= 4 && i <= 7) c.visible = false; });
        person.mesh.children.forEach((c, i) => { if (i < 2) { c.material.color.set(0xffffff); c.material.emissive.set(0x444444); } });
        person.mesh.rotation.x = Math.PI / 2; person.mesh.position.y = 0.1;
        console.log(`[ANGEL] ${person.username} ha muerto, creando angel`);
        angels.push(createAngel(person.scene, person.mesh.position.clone(), person.username, person.avatarUrl));
      }
    }
  }

  updateAngels(angels, t);

  for (const person of people) {
    if (person.dead) {
      if (t - person.deathTime > 3) person.mesh.visible = false;
      if (t - person.deathTime > 5) respawnPerson(person);
      continue;
    }
    person.time += dt * person.speed;
    if (person.direction === 'x') {
      person.mesh.position.x = person.origin.x + person.time * person.speed * 2;
      person.mesh.position.z = person.origin.z;
    } else {
      person.mesh.position.z = person.origin.z + person.time * person.speed * 2;
      person.mesh.position.x = person.origin.x;
    }
    person.mesh.rotation.y = person.direction === 'x' ? Math.PI / 2 : 0;
    person.legPhase += dt * person.speed * 3;
    person.armPhase += dt * person.speed * 3;
    const legAngle = Math.sin(person.legPhase) * 0.3;
    const armAngle = Math.sin(person.armPhase) * 0.4;
    if (person.mesh.children[4]) person.mesh.children[4].rotation.x = legAngle;
    if (person.mesh.children[5]) person.mesh.children[5].rotation.x = -legAngle;
    if (person.mesh.children[2]) person.mesh.children[2].rotation.x = armAngle;
    if (person.mesh.children[3]) person.mesh.children[3].rotation.x = -armAngle;

    if (Math.abs(person.mesh.position.x) > 65 || Math.abs(person.mesh.position.z) > 65) respawnPerson(person);

    if (person.bubble) {
      if (t > person.bubble.expiry) {
        person.mesh.remove(person.bubble.mesh);
        person.bubble.mesh.material.map.dispose();
        person.bubble = null;
      }
    }
  }
}
