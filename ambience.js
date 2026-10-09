import { useEffect, useState } from "react";
import { getContext } from "@/lib/sfx";

// Procedural sea ambience: rolling waves (filtered noise + swell LFO) and a
// looping concertina rendition of the traditional shanty "Drunken Sailor".
// Everything is synthesised with the Web Audio API — no audio files needed.

const KEY = "pitr_ambience";
const BPM = 104;
const EIGHTH = 60 / BPM / 2;
const A = 69, D = 62, F = 65, G = 67, C = 60, E = 64;
// [midi, length in eighths]; null = rest
const MELODY = [
  [A, 2], [A, 1], [A, 1], [A, 1], [A, 1], [A, 1], [A, 1],
  [A, 2], [D, 1], [D, 1], [F, 1], [F, 1], [A, 1], [A, 1],
  [G, 2], [G, 1], [G, 1], [G, 1], [G, 1], [G, 1], [G, 1],
  [G, 2], [C, 1], [C, 1], [E, 1], [E, 1], [G, 1], [G, 1],
  [A, 2], [A, 1], [A, 1], [A, 1], [A, 1], [A, 1], [A, 1],
  [A, 2], [D, 1], [D, 1], [F, 1], [F, 1], [A, 1], [A, 1],
  [G, 2], [G, 1], [G, 1], [A, 2], [A, 1], [A, 1],
  [F, 2], [D, 2], [D, 3], [null, 1],
];
const BASS = [D, D, C, C, D, D, C, D]; // root per bar
const LOOP_EIGHTHS = MELODY.reduce((s, [, l]) => s + l, 0);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

let engine = null;
const listeners = new Set();
let on = false;
const emit = () => listeners.forEach((fn) => fn(on));

function makeNoise(c, seconds = 4) {
  const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02; // brown noise
    d[i] = last * 3.5;
  }
  const s = c.createBufferSource();
  s.buffer = b;
  s.loop = true;
  return s;
}

function buildWaves(c, out) {
  const swell = c.createGain();
  swell.gain.value = 0.35;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.09;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.28;
  lfo.connect(lfoGain).connect(swell.gain);
  lfo.start();

  const deep = makeNoise(c);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  deep.connect(lp).connect(swell);
  deep.start();

  const foam = makeNoise(c, 3);
  const hp = c.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.value = 1800;
  hp.Q.value = 0.6;
  const foamGain = c.createGain();
  foamGain.gain.value = 0.06;
  const lfo2 = c.createOscillator();
  lfo2.frequency.value = 0.13;
  const lfo2Gain = c.createGain();
  lfo2Gain.gain.value = 0.05;
  lfo2.connect(lfo2Gain).connect(foamGain.gain);
  lfo2.start();
  foam.connect(hp).connect(foamGain).connect(swell);
  foam.start();

  swell.connect(out);
  return [lfo, lfo2, deep, foam];
}

function note(c, out, midi, t, dur, gain) {
  const f = hz(midi);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2200;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.03);
  g.gain.setValueAtTime(gain, t + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  [-6, 6].forEach((cents) => {
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f * 2 ** (cents / 1200);
    o.connect(lp);
    o.start(t);
    o.stop(t + dur + 0.05);
  });
  lp.connect(g).connect(out);
}

function bass(c, out, midi, t) {
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.value = hz(midi - 24);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + EIGHTH * 3.5);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + EIGHTH * 4);
}

function stomp(c, out, t) {
  const o = c.createOscillator();
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
  const g = c.createGain();
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.15);
}

function buildShanty(c, out) {
  const bus = c.createGain();
  bus.gain.value = 0.1;
  const echo = c.createDelay(1);
  echo.delayTime.value = EIGHTH * 3;
  const fb = c.createGain();
  fb.gain.value = 0.22;
  echo.connect(fb).connect(echo);
  bus.connect(out);
  bus.connect(echo).connect(out);

  let loopStart = c.currentTime + 0.4;
  let nextIndex = 0;
  let offset = 0; // eighths since loop start
  const schedule = () => {
    while (loopStart + offset * EIGHTH < c.currentTime + 0.5) {
      const [m, len] = MELODY[nextIndex];
      const t = loopStart + offset * EIGHTH;
      if (offset % 8 === 0) { bass(c, bus, BASS[(offset / 8) % BASS.length], t); stomp(c, bus, t); }
      if (offset % 8 === 4) stomp(c, bus, t);
      if (m !== null) note(c, bus, m, t, len * EIGHTH * 0.92, 0.09);
      offset += len;
      nextIndex += 1;
      if (nextIndex >= MELODY.length) { nextIndex = 0; loopStart += LOOP_EIGHTHS * EIGHTH; offset = 0; }
    }
  };
  const timer = setInterval(schedule, 120);
  schedule();
  return () => clearInterval(timer);
}

function start() {
  const c = getContext();
  const master = c.createGain();
  master.gain.setValueAtTime(0.0001, c.currentTime);
  master.gain.exponentialRampToValueAtTime(1, c.currentTime + 2.5);
  master.connect(c.destination);
  const nodes = buildWaves(c, master);
  const stopShanty = buildShanty(c, master);
  engine = { master, nodes, stopShanty, ctx: c };
}

function stop() {
  if (!engine) return;
  const { master, nodes, stopShanty, ctx } = engine;
  engine = null;
  stopShanty();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
  setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }); master.disconnect(); }, 1400);
}

export function setAmbience(next) {
  on = next;
  localStorage.setItem(KEY, on ? "on" : "off");
  try { if (on && !engine) start(); else if (!on) stop(); } catch (e) { on = false; }
  emit();
}

// Browsers block audio until a gesture — if the sailor left music on last
// time, resume it on the first click/tap instead of on page load.
if (typeof window !== "undefined" && localStorage.getItem(KEY) === "on") {
  const resume = () => { setAmbience(true); window.removeEventListener("pointerdown", resume); window.removeEventListener("keydown", resume); };
  window.addEventListener("pointerdown", resume, { once: true });
  window.addEventListener("keydown", resume, { once: true });
}

export function useAmbience() {
  const [state, setState] = useState(on);
  useEffect(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  }, []);
  return [state, () => setAmbience(!on), localStorage.getItem(KEY) === "on" && !on];
}
