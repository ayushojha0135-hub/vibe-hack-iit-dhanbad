let ctx;
const ac = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};
export const getContext = ac;

// Autoplay policy: create/resume the context on the first user gesture so
// later programmatic sounds (idle roasts, chest opens) are not blocked.
if (typeof window !== "undefined") {
  const unlock = () => { try { ac(); } catch (e) { /* no audio */ } };
  ["pointerdown", "keydown", "touchstart"].forEach((e) => window.addEventListener(e, unlock, { once: true, passive: true }));
}

function noise(c, dur) {
  const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = b;
  return s;
}

function env(c, t, peak, dur) {
  const g = c.createGain();
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  g.connect(c.destination);
  return g;
}

function safe(fn) {
  return (...a) => { try { fn(...a); } catch (e) { /* audio blocked */ } };
}

export const cannon = safe(() => {
  const c = ac(), t = c.currentTime;
  const n = noise(c, 1.3);
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(2200, t);
  f.frequency.exponentialRampToValueAtTime(70, t + 1.1);
  n.connect(f).connect(env(c, t, 0.8, 1.2));
  n.start(t);
  const o = c.createOscillator();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(28, t + 0.55);
  o.connect(env(c, t, 0.9, 0.6));
  o.start(t);
  o.stop(t + 0.6);
});

export const coin = safe((count = 6) => {
  const c = ac();
  for (let i = 0; i < count; i++) {
    const t = c.currentTime + i * 0.085 + Math.random() * 0.03;
    const base = 2100 + Math.random() * 900;
    [1, 2.76, 5.4].forEach((m, k) => {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = base * m;
      o.connect(env(c, t, 0.18 / (k + 1), 0.4 - k * 0.1));
      o.start(t);
      o.stop(t + 0.45);
    });
  }
});

export const squawk = safe(() => {
  const c = ac(), t = c.currentTime;
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(900, t);
  o.frequency.linearRampToValueAtTime(1900, t + 0.08);
  o.frequency.linearRampToValueAtTime(700, t + 0.32);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1500;
  f.Q.value = 3;
  o.connect(f).connect(env(c, t, 0.35, 0.36));
  o.start(t);
  o.stop(t + 0.38);
});

export const laugh = safe(() => {
  const c = ac();
  for (let i = 0; i < 5; i++) {
    const t = c.currentTime + i * 0.15;
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(320 - i * 18, t);
    o.frequency.linearRampToValueAtTime(240 - i * 18, t + 0.11);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 900;
    f.Q.value = 2;
    o.connect(f).connect(env(c, t, 0.3, 0.12));
    o.start(t);
    o.stop(t + 0.13);
  }
});

export const thunder = safe(() => {
  const c = ac(), t = c.currentTime;
  const n = noise(c, 2.6);
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 380;
  n.connect(f).connect(env(c, t, 0.9, 2.5));
  n.start(t);
});

export const splash = safe(() => {
  const c = ac(), t = c.currentTime;
  const n = noise(c, 0.7);
  const f = c.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = 900;
  n.connect(f).connect(env(c, t, 0.4, 0.65));
  n.start(t);
});
