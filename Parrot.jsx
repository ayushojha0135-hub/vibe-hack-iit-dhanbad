import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Volume2, VolumeX, X } from "lucide-react";
import { ParrotSvg } from "@/components/ParrotSvg";
import { useParrot } from "@/context/ParrotContext";
import { API, getToken, http } from "@/lib/api";
import * as sfx from "@/lib/sfx";

const CHIPS = ["Admission kaise milega?", "Placements ka scene kya hai?", "Mid-term kab hai?", "Library mein kya milega?"];

function ChatPanel({ onClose }) {
  const { speak } = useParrot();
  const [msgs, setMsgs] = useState([{ role: "parrot", text: "Ahoy matey! Main Captain Kraken-Byte, PITR ka AI tota. Kuch bhi pucho — admissions se lekar exam ke toofan tak!" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    http.get("/chat/history").then((r) => { if (Array.isArray(r.data) && r.data.length) setMsgs((m) => [m[0], ...r.data]); }).catch(() => {});
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "parrot", text: "" }]);
    let full = "";
    try {
      const res = await fetch(`${API}/chat`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ message: q }) });
      if (!res.ok || !res.body) throw new Error("chat");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        parts.forEach((p) => {
          const d = p.replace(/^data: /, "");
          if (d === "[DONE]") return;
          try { full += JSON.parse(d).t || ""; } catch (e) { /* skip */ }
        });
        setMsgs((m) => [...m.slice(0, -1), { role: "parrot", text: full }]);
      }
    } catch (e) {
      full = "Arrr! Kraken ne cable chaba li. Thodi der mein phir try kar, matey!";
      setMsgs((m) => [...m.slice(0, -1), { role: "parrot", text: full }]);
    }
    setBusy(false);
    if (full) speak(full);
  };

  return (
    <motion.div data-testid="parrot-chat-panel" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.9 }}
      className="fixed z-[70] bottom-24 right-3 left-3 sm:left-auto sm:right-6 sm:w-[380px] rounded-2xl overflow-hidden brass-border glass" style={{ background: "rgba(7,25,35,.95)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6A64F]/25">
        <div>
          <p className="f-display text-[#F2C66D] font-bold tracking-wider">Captain Kraken-Byte</p>
          <p className="f-mono text-[11px] text-[#4DF0D1]">● AI parrot · Claude-powered brain</p>
        </div>
        <button data-testid="parrot-chat-close" onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full text-[#F2C66D] hover:bg-[#174653] transition-colors" aria-label="Close chat"><X size={18} /></button>
      </div>
      <div data-lenis-prevent className="h-[340px] overflow-y-auto px-4 py-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${m.role === "user" ? "ml-auto bg-[#D6A64F] text-[#071923] rounded-br-sm" : "bg-[#174653]/70 text-[#E9D4A5] rounded-bl-sm border border-[#D6A64F]/20"}`}>
            {m.text || <span className="f-mono text-[#F2C66D] animate-pulse">squawk… soch raha hoon…</span>}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {CHIPS.map((c) => (
          <button key={c} data-testid={`parrot-chip-${c.slice(0, 8).replace(/\s/g, "-")}`} onClick={() => send(c)} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[#D6A64F]/40 text-[#F2C66D] hover:bg-[#174653] transition-colors">{c}</button>
        ))}
      </div>
      <form className="flex gap-2 p-3 border-t border-[#D6A64F]/25" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input data-testid="parrot-chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pucho kuch bhi, matey…"
          className="flex-1 bg-[#0B202C] border border-[#D6A64F]/30 rounded-full px-4 py-2.5 text-sm text-[#E9D4A5] placeholder:text-[#E9D4A5]/50 outline-none focus:border-[#F2C66D]" />
        <button data-testid="parrot-chat-send" disabled={busy} className="w-11 h-11 grid place-items-center rounded-full bg-[#D6A64F] text-[#071923] hover:bg-[#F2C66D] disabled:opacity-50 transition-colors" aria-label="Send"><Send size={17} /></button>
      </form>
    </motion.div>
  );
}

export function Parrot({ chatEnabled = true }) {
  const { bubble, say, voiceOn, setVoiceOn, speaking } = useParrot();
  const [chat, setChat] = useState(false);
  const mood = bubble?.mood || "idle";

  return (
    <>
      <AnimatePresence>{chat && <ChatPanel onClose={() => setChat(false)} />}</AnimatePresence>
      <div className="fixed z-[75] bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 md:bottom-5">
      <motion.div data-testid="parrot-companion" className="relative"
        initial={{ y: -900 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.6 }}>
        <AnimatePresence>
          {bubble && !chat && (
            <motion.div key={bubble.key} data-testid="parrot-bubble" initial={{ opacity: 0, y: 10, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute bottom-full mb-3 right-[-60px] md:right-0 w-[min(80vw,300px)] rounded-2xl px-4 py-3 text-sm leading-snug shadow-2xl ${mood === "laugh" ? "bg-[#F2C66D] text-[#071923]" : "parchment"}`}>
              {mood === "laugh" && <span className="f-display font-black block text-xs tracking-widest mb-1 text-[#B91C1C]">GAHARAHA HA HA!</span>}
              <span className="f-quote text-[15px]">{bubble.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-1">
          <button data-testid="parrot-voice-toggle" onClick={() => setVoiceOn(!voiceOn)} aria-label="Toggle voice narrator"
            className={`mb-3 w-9 h-9 grid place-items-center rounded-full border transition-colors ${voiceOn ? "bg-[#D6A64F] text-[#071923] border-[#F2C66D]" : "bg-[#0B202C] text-[#E9D4A5] border-[#D6A64F]/40"}`}>
            {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <motion.button data-testid="parrot-avatar-btn" aria-label="Talk to the AI parrot"
            animate={mood === "laugh" ? { rotate: [0, -12, 12, -10, 10, 0], y: [0, -10, 0, -8, 0] } : { y: [0, -5, 0] }}
            transition={mood === "laugh" ? { duration: 0.9 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
            onClick={() => { sfx.squawk(); if (chatEnabled) setChat((c) => !c); else say("Pehle login kar, phir baatein karenge, matey!"); }}
            className="relative drop-shadow-[0_0_25px_rgba(242,198,109,.45)]">
            <ParrotSvg mood={mood} talking={speaking} size={78} />
            {speaking && <span className="absolute -top-1 -left-1 f-mono text-[10px] px-1.5 py-0.5 rounded bg-[#4DF0D1] text-[#071923]">LIVE</span>}
          </motion.button>
        </div>
      </motion.div>
      </div>
    </>
  );
}
