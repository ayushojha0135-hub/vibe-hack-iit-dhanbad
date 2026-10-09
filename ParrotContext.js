import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import { toast } from "sonner";
import { API, getToken, pick } from "@/lib/api";
import * as sfx from "@/lib/sfx";

const ParrotCtx = createContext(null);
export const useParrot = () => useContext(ParrotCtx);

const IDLE = [
  "Sleeping on duty? Walk the plank! Arrr, uth ja matey!",
  "Oye deckhand! Itni der se kuch nahi kiya? Captain dekh raha hai!",
  "Zzz... Mouse hila le bhai, warna sharks ko attendance de dunga!",
];

export function ParrotProvider({ children }) {
  const [bubble, setBubble] = useState(null);
  const [voiceOn, setVoiceOn] = useState(() => localStorage.getItem("pitr_voice") !== "off");
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);
  const hideT = useRef(null);
  const seq = useRef(0);
  const voiceRef = useRef(voiceOn);
  const laughRef = useRef(null);

  const stopAudio = useCallback(() => {
    seq.current += 1;
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => {
    voiceRef.current = voiceOn;
    localStorage.setItem("pitr_voice", voiceOn ? "on" : "off");
    if (!voiceOn) stopAudio();
  }, [voiceOn, stopAudio]);

  const browserSpeak = (text) => {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1.25;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const speak = useCallback(async (text) => {
    if (!voiceRef.current) return;
    stopAudio();
    const my = seq.current;
    const token = getToken();
    if (!token) { browserSpeak(text); return; }
    try {
      const res = await fetch(`${API}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: text.slice(0, 590) }),
      });
      if (!res.ok) throw new Error("tts");
      const url = URL.createObjectURL(await res.blob());
      if (my !== seq.current) return;
      const a = new Audio(url);
      audioRef.current = a;
      a.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      setSpeaking(true);
      await a.play();
    } catch (e) {
      if (my === seq.current) browserSpeak(text);
    }
  }, [stopAudio]);

  const say = useCallback((text, { mood = "talk", voice = true, ms } = {}) => {
    clearTimeout(hideT.current);
    setBubble({ text, mood, key: Date.now() });
    hideT.current = setTimeout(() => setBubble(null), ms ?? Math.max(4500, text.length * 75));
    if (voice) speak(text);
  }, [speak]);

  const laugh = useCallback((text) => {
    sfx.laugh();
    say(text, { mood: "laugh" });
    toast(text, { description: "— Captain Kraken-Byte, AI Parrot" });
  }, [say]);
  laughRef.current = laugh;

  useEffect(() => {
    let t;
    const reset = () => { clearTimeout(t); t = setTimeout(() => laughRef.current(pick(IDLE)), 45000); };
    const evs = ["mousemove", "keydown", "scroll", "touchstart"];
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, reset)); };
  }, []);

  const value = { bubble, say, laugh, speak, stopAudio, voiceOn, setVoiceOn, speaking, setBubble };
  return <ParrotCtx.Provider value={value}>{children}</ParrotCtx.Provider>;
}

export function useNarrate(ref, text, amount = 0.45) {
  const { say } = useParrot();
  const inView = useInView(ref, { amount, once: true });
  useEffect(() => {
    if (inView && text) say(text);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
}
