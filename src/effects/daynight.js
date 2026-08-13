import * as THREE from 'three';

let timeOfDay = 0;
let lastWindowToggle = Date.now();
const fogColor = new THREE.Color();

export function updateDayNightCycle(scene, dirLight, ambientLight, hemiLight) {
  timeOfDay += 0.0001;
  if (timeOfDay > 1) timeOfDay = 0;

  const dayProgress = Math.sin(timeOfDay * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;

  fogColor.setHSL(0.55, 0.5, 0.4 + dayProgress * 0.45);
  scene.fog.color = fogColor;

  dirLight.intensity = 0.3 + dayProgress * 2.0;
  ambientLight.intensity = 0.15 + dayProgress * 0.35;
  if (hemiLight) hemiLight.intensity = 0.3 + dayProgress * 0.5;

  const sunAngle = timeOfDay * Math.PI * 2;
  dirLight.position.set(
    Math.cos(sunAngle) * 60,
    Math.sin(sunAngle) * 60 + 30,
    30
  );

  const sunColor = new THREE.Color();
  if (dayProgress > 0.7) {
    sunColor.setHSL(0.12, 0.8, 0.8);
  } else if (dayProgress > 0.3) {
    sunColor.setHSL(0.08, 1, 0.6);
  } else {
    sunColor.setHSL(0.6, 0.4, 0.2);
  }
  dirLight.color = sunColor;
}

export function updateWindowsIfNeeded(buildings, updateWindows) {
  const now = Date.now();
  if (now - lastWindowToggle > 5000) {
    lastWindowToggle = now;
    if (Math.random() < 0.1) {
      updateWindows(buildings);
    }
  }
}
