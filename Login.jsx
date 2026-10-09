import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Anchor } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useParrot } from "@/context/ParrotContext";
import { CannonButton, MaskLines } from "@/components/fx";
import { Logo } from "@/components/Logo";
import { Parrot } from "@/components/Parrot";
import { AmbienceToggle } from "@/components/AmbienceToggle";
import { Boarding } from "@/components/Boarding";
import { errMsg } from "@/lib/api";
import * as sfx from "@/lib/sfx";

const SECTIONS = ["CSE-A", "CSE-B", "AI-ML", "ECE-A", "MECH-A", "CIVIL-A"];

const Fish = () => (
  <svg width="120" height="64" viewBox="0 0 120 64" aria-hidden>
    <defs><linearGradient id="fg" x1="0" x2="1"><stop offset="0" stopColor="#F2C66D" /><stop offset="1" stopColor="#D97706" /></linearGradient></defs>
    <path d="M18 32 Q50 2 92 26 Q100 32 92 38 Q50 62 18 32Z" fill="url(#fg)" />
    <path d="M18 32 L0 14 L6 32 L0 50Z" fill="#D6A64F" />
    <path d="M52 14 Q60 4 70 16" fill="#B45309" />
    <path d="M46 20 Q52 32 46 44 M60 18 Q66 32 60 46" stroke="#92400E" strokeWidth="1.5" fill="none" opacity=".6" />
    <circle cx="82" cy="28" r="5" fill="#fff" /><circle cx="83.5" cy="28" r="2.6" fill="#071923" />
  </svg>
);

function Bubbles() {
  const list = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ i, l: Math.random() * 100, s: 4 + Math.random() * 14, d: 6 + Math.random() * 10, dl: Math.random() * 8, sw: `${(Math.random() - 0.5) * 80}px` })), []);
  return list.map((b) => <span key={b.i} className="bubble" style={{ left: `${b.l}%`, width: b.s, height: b.s, animationDuration: `${b.d}s`, animationDelay: `${b.dl}s`, "--sway": b.sw }} />);
}

function Field({ label, testId, ...p }) {
  return (
    <label className="block">
      <span className="eyebrow text-[11px]">{label}</span>
      <input data-testid={testId} {...p} className="mt-2 w-full bg-[#071923]/70 border border-[#D6A64F]/35 rounded-xl px-4 py-3 text-[#E9D4A5] placeholder:text-[#E9D4A5]/45 outline-none focus:border-[#F2C66D] focus:shadow-[0_0_0_4px_rgba(242,198,109,.12)] transition-shadow" />
    </label>
  );
}

function AuthForm({ onDone }) {
  const { login, register } = useAuth();
  const { say, laugh } = useParrot();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "", section: "CSE-A" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    setErr("");
    setBusy(true);
    try {
      const u = mode === "login" ? await login(f.email, f.password) : await register(f);
      onDone(u);
    } catch (e) {
      const m = errMsg(e);
      setErr(m);
      laugh(`Gaharaha ha! ${m}`);
    }
    setBusy(false);
  };

  return (
    <div data-testid="login-card" className="relative w-full max-w-md rounded-3xl p-7 sm:p-9 brass-border glass grain overflow-hidden">
      <div className="flex gap-2 p-1 rounded-full bg-[#071923]/70 border border-[#D6A64F]/25 mb-7">
        {[["login", "Board Ship"], ["register", "Join the Crew"]].map(([k, l]) => (
          <button key={k} data-testid={`auth-tab-${k}`} onClick={() => { setMode(k); say(k === "login" ? "Purane crew member ho? Email aur password daalo, matey." : "Naya deckhand! Naam, email, password aur apna class section chuno."); }}
            className={`flex-1 py-2.5 rounded-full f-display text-xs font-bold tracking-[0.15em] transition-colors ${mode === k ? "bg-[#D6A64F] text-[#071923]" : "text-[#E9D4A5] hover:text-[#F2C66D]"}`}>{l}</button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        {mode === "register" && <Field label="Pirate Name" testId="auth-name-input" value={f.name} onChange={up("name")} placeholder="Jack Sparrow Sharma" required />}
        <Field label="Message-in-a-bottle (Email)" testId="auth-email-input" type="email" value={f.email} onChange={up("email")} placeholder="you@pitr.edu" required
          onFocus={() => say("Yahan apna email likho. Bottle mein daal ke bhejenge.", { voice: false })} />
        <Field label="Secret Pass-phrase" testId="auth-password-input" type="password" value={f.password} onChange={up("password")} placeholder="••••••••" required minLength={6}
          onFocus={() => say("Password daalo. Parrot nahi dekh raha… shayad.", { voice: false })} />
        {mode === "register" && (
          <label className="block">
            <span className="eyebrow text-[11px]">Ship / Class Section</span>
            <select data-testid="auth-section-select" value={f.section} onChange={up("section")} className="mt-2 w-full bg-[#071923] border border-[#D6A64F]/35 rounded-xl px-4 py-3 text-[#E9D4A5] outline-none focus:border-[#F2C66D]">
              {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        )}
        {err && <p data-testid="auth-error" className="text-sm text-[#fca5a5]">{err}</p>}
        <CannonButton testId="auth-submit-button" className="w-full justify-center mt-2" disabled={busy} onClick={() => document.querySelector("[data-testid=auth-form-real-submit]")?.click()}>
          {busy ? "Loading cannons…" : mode === "login" ? "Fire & Board" : "Enlist Me"}
        </CannonButton>
        <button data-testid="auth-form-real-submit" type="submit" className="hidden" aria-hidden />
      </form>
      <p className="f-quote italic text-[#E9D4A5]/80 text-sm mt-6 text-center">"Attendance 75% se kam? Toh plank tumhara intezaar kar raha hai."</p>
    </div>
  );
}

export default function LoginPage() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();
  const { say } = useParrot();
  const [stage, setStage] = useState("intro");
  const [boardUser, setBoardUser] = useState(null);

  useEffect(() => { if (user) nav("/", { replace: true }); }, [user, nav]);
  useEffect(() => {
    const t1 = setTimeout(() => say("Ahoy! Ye hai PITR ka doobta hua purana jahaaz. Dekho, ek machli bahar aa rahi hai… wahi tumhara login darwaza hai!", { voice: false }), 1200);
    const t2 = setTimeout(() => setStage("form"), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [say]);
  useEffect(() => { if (stage === "form") sfx.splash(); }, [stage]);

  return (
    <div data-shake className="relative min-h-screen overflow-hidden bg-[#04121a]">
      <motion.img src="/assets/sunken_ship.jpg" alt="Sunken pirate shipwreck on the ocean floor" className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.25, filter: "blur(6px) brightness(.5)" }} animate={{ scale: 1.08, filter: "blur(0px) brightness(.8)" }} transition={{ duration: 3.5, ease: "easeOut" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#04121a]/70 via-transparent to-[#04121a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#04121a]/90 via-[#04121a]/30 to-transparent" />
      <div className="godrays" />
      <Bubbles />

      <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 py-6">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="eyebrow hidden sm:flex items-center gap-2"><Anchor size={14} /> Depth: 1,200 fathoms</span>
          <AmbienceToggle />
        </div>
      </header>

      <main className="relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center px-5 sm:px-10 lg:px-16 pb-28 pt-6 lg:pt-10 min-h-[calc(100vh-96px)]">
        <div>
          <p className="eyebrow mb-6">Est. 1717 · Under the Black Kraken Charter</p>
          <h1 className="f-display font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.95] text-[#E9D4A5]">
            <MaskLines lines={["Even the", "sunken ships", "still take"]} />
            <MaskLines lines={["attendance."]} lineClass="gold-text" delay={0.45} />
          </h1>
          <p className="mt-7 max-w-lg text-base sm:text-lg text-[#E9D4A5]/85 leading-relaxed">
            Welcome to the official logbook of the <span className="text-[#F2C66D]">Pirate Institute of Technology &amp; Research</span>. Follow the fish out of the wreck and sign in to begin yer semester voyage.
          </p>
        </div>

        <div className="relative grid place-items-center min-h-[480px]">
          <AnimatePresence>
            {stage === "intro" && (
              <motion.button key="fish" data-testid="login-fish" onClick={() => setStage("form")} aria-label="Follow the fish"
                className="absolute" initial={{ x: 260, y: 140, scale: 0.4, rotate: -10 }}
                animate={{ x: [260, 120, 40, 0], y: [140, 60, 90, 0], scale: [0.4, 0.8, 1, 1.4], rotate: [-10, 8, -6, 0] }}
                exit={{ x: -500, y: -200, scale: 0.6, opacity: 0, transition: { duration: 0.9 } }} transition={{ duration: 3.2, ease: "easeInOut" }}>
                <Fish />
                <span className="block mt-2 f-mono text-xs text-[#F2C66D] tracking-widest">TAP THE FISH ↗</span>
              </motion.button>
            )}
          </AnimatePresence>
          {stage === "form" && (
            <motion.div className="w-full grid place-items-center" initial={{ opacity: 0, scale: 0.3, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ type: "spring", stiffness: 120, damping: 15 }}>
              <AuthForm onDone={(u) => { setBoardUser(u); setStage("boarding"); }} />
            </motion.div>
          )}
        </div>
      </main>

      {stage === "boarding" && boardUser && <Boarding user={boardUser} onDone={() => setUser(boardUser)} />}
      {stage !== "boarding" && <Parrot chatEnabled={false} />}
    </div>
  );
}
