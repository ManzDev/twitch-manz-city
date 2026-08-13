let ctx = null;
let masterGain = null;
let isPlaying = false;
let scheduler = null;
let currentStep = 0;
let nextNoteTime = 0;
const BPM = 78;
const STEP_TIME = 60 / BPM / 4;
const SWING = 0.025;

const NOTE = (n) => 261.63 * Math.pow(2, n / 12);

const SECTIONS = [
  {
    name: 'intro',
    bass: [-12,-12,-12,-12, -8,-8,-8,-8, -5,-5,-5,-5, -1,-1,-1,-1],
    chords: [[0,4,7],[0,4,7],[5,9,12],[5,9,12],[3,7,10],[3,7,10],[-1,3,7],[-1,3,7]],
    melody: [-1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1],
    drums: { kick:0, snare:0, hat:0 },
    bassVol: 0.15, padVol: 0.04, melodyVol: 0, arpVol: 0
  },
  {
    name: 'build',
    bass: [-12,-12,-10,-10, -8,-8,-5,-5, -12,-12,-10,-10, -8,-8,-5,-5],
    chords: [[0,4,7],[0,4,7],[5,9,12],[5,9,12],[3,7,10],[3,7,10],[-1,3,7],[-1,3,7]],
    melody: [12,-1,14,-1, 12,-1,10,-1, 12,-1,8,-1, 7,-1,5,-1],
    drums: { kick:0, snare:0, hat:1 },
    bassVol: 0.17, padVol: 0.05, melodyVol: 0.08, arpVol: 0
  },
  {
    name: 'main',
    bass: [-12,-12,-10,-8, -5,-5,-8,-10, -12,-12,-10,-8, -1,-1,3,5],
    chords: [[0,4,7],[0,4,7],[5,9,12],[5,9,12],[8,12,15],[8,12,15],[3,7,10],[3,7,10]],
    melody: [12,14,12,-1, 17,-1,14,12, 10,12,10,-1, 14,-1,12,10],
    drums: { kick:1, snare:1, hat:1 },
    bassVol: 0.18, padVol: 0.05, melodyVol: 0.1, arpVol: 0.04
  },
  {
    name: 'break',
    bass: [-5,-5,-5,-5, -8,-8,-8,-8, -10,-10,-10,-10, -12,-12,-12,-12],
    chords: [[3,7,10],[3,7,10],[0,4,7],[0,4,7],[-1,3,7],[-1,3,7],[5,9,12],[5,9,12]],
    melody: [10,-1,-1,-1, 8,-1,-1,-1, 7,-1,-1,-1, 5,-1,3,-1],
    drums: { kick:1, snare:0, hat:0 },
    bassVol: 0.16, padVol: 0.06, melodyVol: 0.07, arpVol: 0
  }
];

let sectionIndex = 0;
let sectionStep = 0;
const SECTION_LEN = 16;

function getSection() { return SECTIONS[sectionIndex]; }

function nextSection() {
  sectionIndex = (sectionIndex + 1) % SECTIONS.length;
  sectionStep = 0;
}

const KICK =  [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0];
const SNARE = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
const HAT =   [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1];

function makeNoise(dur) {
  const n = ctx.sampleRate * dur;
  const b = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function playKick(t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(100, t);
  o.frequency.exponentialRampToValueAtTime(30, t + 0.2);
  g.gain.setValueAtTime(0.4, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  o.connect(g).connect(masterGain);
  o.start(t); o.stop(t + 0.45);
}

function playSnare(t) {
  const src = ctx.createBufferSource();
  src.buffer = makeNoise(0.1);
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 2500; f.Q.value = 0.6;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  src.connect(f).connect(g).connect(masterGain);
  src.start(t); src.stop(t + 0.1);
}

function playHat(t) {
  const src = ctx.createBufferSource();
  src.buffer = makeNoise(0.035);
  const f = ctx.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = 9000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
  src.connect(f).connect(g).connect(masterGain);
  src.start(t); src.stop(t + 0.035);
}

function playBass(t, semitone, dur, vol) {
  if (semitone < 0) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(NOTE(semitone), t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.04);
  g.gain.setValueAtTime(vol * 0.8, t + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 280;
  o.connect(f).connect(g).connect(masterGain);
  o.start(t); o.stop(t + dur + 0.01);
}

function playPad(t, semitones, dur, vol) {
  semitones.forEach((s, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(NOTE(s), t);
    o.detune.setValueAtTime((i - 1) * 10, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.8);
    g.gain.setValueAtTime(vol * 0.7, t + dur - 0.5);
    g.gain.linearRampToValueAtTime(0.001, t + dur);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 600; f.Q.value = 0.5;
    o.connect(f).connect(g).connect(masterGain);
    o.start(t); o.stop(t + dur + 0.01);
  });
}

function playMelody(t, semitone, dur, vol) {
  if (semitone < 0 || vol <= 0) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(NOTE(semitone), t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.05);
  g.gain.setValueAtTime(vol * 0.7, t + dur * 0.5);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 1800;
  o.connect(f).connect(g).connect(masterGain);
  o.start(t); o.stop(t + dur + 0.01);
}

function playArp(t, semitone, dur, vol) {
  if (semitone < 0 || vol <= 0) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(NOTE(semitone), t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol * 0.5, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 1500;
  o.connect(f).connect(g).connect(masterGain);
  o.start(t); o.stop(t + dur + 0.01);
}

function scheduleStep(step, time) {
  const sec = getSection();
  const s = step % 16;
  const chordIdx = Math.floor(s / 2) % sec.chords.length;
  const swingOff = (s % 2 === 1) ? SWING : 0;

  if (sec.drums.kick && KICK[s]) playKick(time);
  if (sec.drums.snare && SNARE[s]) playSnare(time);
  if (sec.drums.hat && HAT[s]) playHat(time);

  playBass(time + swingOff, sec.bass[s], STEP_TIME * 1.6, sec.bassVol);

  if (s % 4 === 0) {
    playPad(time, sec.chords[chordIdx], STEP_TIME * 4, sec.padVol);
  }

  playMelody(time + swingOff, sec.melody[s], STEP_TIME * 1.4, sec.melodyVol);

  if (sec.arpVol > 0 && s % 2 === 0) {
    const arpNote = sec.chords[chordIdx][s % 3] + 12;
    playArp(time, arpNote, STEP_TIME * 1.8, sec.arpVol);
  }

  sectionStep++;
  if (sectionStep >= SECTION_LEN) nextSection();
}

function schedulerLoop() {
  while (nextNoteTime < ctx.currentTime + 0.1) {
    scheduleStep(currentStep, nextNoteTime);
    const swingOff = (currentStep % 2 === 1) ? SWING : 0;
    nextNoteTime += STEP_TIME + swingOff;
    currentStep++;
  }
}

export function initMusic() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = ctx.createGain();
  masterGain.gain.value = 0.6;

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 12;
  comp.ratio.value = 2.5;

  masterGain.connect(comp).connect(ctx.destination);
}

export function startMusic() {
  if (!ctx || isPlaying) return;
  if (ctx.state === 'suspended') ctx.resume();
  isPlaying = true;
  currentStep = 0;
  sectionStep = 0;
  sectionIndex = 0;
  nextNoteTime = ctx.currentTime;
  scheduler = setInterval(schedulerLoop, 25);
}

export function stopMusic() {
  isPlaying = false;
  if (scheduler) clearInterval(scheduler);
  scheduler = null;
}

export function toggleMusic() {
  if (isPlaying) stopMusic();
  else startMusic();
  return isPlaying;
}
