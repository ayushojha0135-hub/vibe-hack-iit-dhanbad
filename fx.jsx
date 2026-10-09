import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X } from "lucide-react";
import * as sfx from "@/lib/sfx";
import { pick } from "@/lib/api";
import { useParrot } from "@/context/ParrotContext";

const spawn = (cls, x, y, style = {}, life = 1500) => {
  const d = document.createElement("div");
  d.className = cls;
  d.style.left = `${x}px`;
  d.style.top = `${y}px`;
  Object.entries(style).forEach(([k, v]) => d.style.setProperty(k, v));
  document.body.appendChild(d);
  setTimeout(() => d.remove(), life);
};

export function fireCannon(x, y) {
  sfx.cannon();
  const root = document.querySelector("[data-shake]");
  if (root) {
    root.classList.remove("shake");
    void root.offsetWidth;
    root.classList.add("shake");
    setTimeout(() => root.classList.remove("shake"), 550);
  }
  spawn("fx-flash", x, y, {}, 500);
  for (let i = 0; i < 16; i++) {
    const s = 22 + Math.random() * 36;
    spawn("fx-smoke", x - s / 2, y - s / 2, {
      width: `${s}px`, height: `${s}px`,
      "--dx": `${(Math.random() - 0.5) * 220}px`, "--dy": `${-40 - Math.random() * 160}px`,
      "animation-delay": `${Math.random() * 0.15}s`,
    });
  }
}

export function coinBurst(x, y, n = 14) {
  sfx.coin(7);
  for (let i = 0; i < n; i++) {
    spawn("fx-coin", x - 11, y - 11, {
      "--dx": `${(Math.random() - 0.5) * 320}px`, "--up": `${-80 - Math.random() * 140}px`,
      "animation-delay": `${i * 0.03}s`,
    }, 1600);
  }
}

export function CannonButton({ children, onClick, variant = "gold", className = "", testId, icon = true, ...rest }) {
  const fire = (e) => { fireCannon(e.clientX, e.clientY); onClick?.(e); };
  return (
    <button type="button" data-testid={testId} onClick={fire} className={`cannon-btn cannon-${variant} ${className}`} {...rest}>
      {icon && (
        <svg className="cannon-ico" width="22" height="14" viewBox="0 0 44 28" aria-hidden>
          <rect x="6" y="6" width="30" height="12" rx="6" fill="currentColor" transform="rotate(-12 20 12)" />
          <circle cx="14" cy="21" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="40" cy="5" r="2.5" fill="currentColor" opacity=".6" />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}

const EASE = [0.7, 0, 0.2, 1];
export function Unroll({ children, className = "", delay = 0, rod = true }) {
  return (
    <motion.div className={`relative ${className}`} initial="rolled" whileInView="open" viewport={{ once: true, amount: 0.1 }}>
      <motion.div className="h-full" variants={{ rolled: { clipPath: "inset(0% 0% 100% 0%)" }, open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, ease: EASE, delay } } }}>
        {children}
      </motion.div>
      {rod && (
        <motion.div aria-hidden className="unroll-rod"
          variants={{ rolled: { top: "0%", opacity: 1 }, open: { top: "100%", opacity: 0, transition: { duration: 1.2, ease: EASE, delay, opacity: { delay: delay + 1.05, duration: 0.3 } } } }} />
      )}
    </motion.div>
  );
}

export function TiltCard({ children, className = "", testId, onClick }) {
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 12 }), sry = useSpring(ry, { stiffness: 140, damping: 12 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <div className="group h-full" style={{ perspective: 1000 }}>
      <motion.div data-testid={testId} onClick={onClick} onMouseMove={move} onMouseLeave={leave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }} className="h-full">
        <div className={`rock-inner h-full ${className}`}>{children}</div>
      </motion.div>
    </div>
  );
}

const CLOSE_ROASTS = [
  "Gaharaha ha! Bhaag raha hai treasure chhod ke? Darpok deckhand!",
  "Arrr! Chest band kar diya? Khazana bhi tujhse dar gaya, matey!",
  "Ha ha ha! Close karne mein toh first aata hai, padhai mein kab?",
];

export function ChestModal({ open, onClose, title, eyebrow, children, testId = "chest-modal" }) {
  const { laugh } = useParrot();
  const close = () => { laugh(pick(CLOSE_ROASTS)); onClose(); };
  useEffect(() => {
    if (!open) return undefined;
    sfx.coin(4);
    window.__lenis?.stop();
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); window.__lenis?.start(); };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div data-testid={testId} className="fixed inset-0 z-[80] grid place-items-center p-4 bg-[#071923]/85 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl" style={{ perspective: 1200 }}
            initial={{ scale: 0.35, y: 120, rotateX: 25 }} animate={{ scale: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.6, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 170, damping: 17 }}>
            <div className="chest-rays" />
            <motion.div aria-hidden className="absolute -top-2 left-0 right-0 h-16 rounded-t-2xl origin-bottom z-20 border border-[#D6A64F]/60"
              style={{ background: "linear-gradient(180deg,#6b4220,#3a2210)" }}
              initial={{ rotateX: 0, opacity: 1 }} animate={{ rotateX: -120, opacity: 0 }} transition={{ duration: 0.75, ease: EASE, delay: 0.05 }} />
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span key={i} aria-hidden className="absolute left-1/2 top-6 w-4 h-4 rounded-full z-30"
                style={{ background: "radial-gradient(circle at 35% 30%,#FFF4C2,#F2C66D 45%,#A87A2C)" }}
                initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: (i - 4.5) * 46, y: [-20, -140 - (i % 3) * 30, 40], opacity: [1, 1, 0] }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }} />
            ))}
            <div className="relative rounded-2xl overflow-hidden brass-border shadow-[0_0_120px_-10px_rgba(242,198,109,.55)]"
              style={{ background: "linear-gradient(180deg,#0f2a36,#071923)" }}>
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#D6A64F]/25">
                <div>
                  {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
                  <h3 className="f-display text-2xl sm:text-3xl gold-text font-bold">{title}</h3>
                </div>
                <button data-testid={`${testId}-close`} onClick={close} aria-label="Close"
                  className="shrink-0 w-10 h-10 grid place-items-center rounded-full border border-[#D6A64F]/50 text-[#F2C66D] hover:bg-[#174653] transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div data-lenis-prevent className="max-h-[70vh] overflow-y-auto px-6 py-6">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CompassCursor({ scopeRef }) {
  const [p, setP] = useState({ x: 0, y: 0, a: 0, on: false, hot: false });
  useEffect(() => {
    const el = scopeRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return undefined;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      let best = null, bd = 1e9;
      el.querySelectorAll("button, a").forEach((t) => {
        const b = t.getBoundingClientRect();
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        const d = Math.hypot(cx - e.clientX, cy - e.clientY);
        if (d < bd) { bd = d; best = { cx, cy }; }
      });
      const a = best ? (Math.atan2(best.cy - e.clientY, best.cx - e.clientX) * 180) / Math.PI + 90 : 0;
      setP({ x: e.clientX - r.left, y: e.clientY - r.top, a, on: true, hot: !!e.target.closest("button, a") });
    };
    const leave = () => setP((s) => ({ ...s, on: false }));
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [scopeRef]);
  if (!p.on) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute z-40" style={{ left: p.x, top: p.y, transform: `translate(-50%,-50%) scale(${p.hot ? 1.35 : 1})`, transition: "transform .2s ease" }}>
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r="20" fill="rgba(7,25,35,.55)" stroke="#D6A64F" strokeWidth="1.5" />
        <circle cx="23" cy="23" r="15" fill="none" stroke="#D6A64F" strokeOpacity=".4" strokeDasharray="2 3" />
        <g style={{ transform: `rotate(${p.a}deg)`, transformOrigin: "23px 23px", transition: "transform .15s ease-out" }}>
          <path d="M23 6 L27 23 L23 26 L19 23Z" fill="#B91C1C" />
          <path d="M23 40 L27 23 L23 20 L19 23Z" fill="#F2C66D" />
        </g>
        <circle cx="23" cy="23" r="2.4" fill="#F2C66D" />
      </svg>
    </div>
  );
}

export function MaskLines({ lines, className = "", lineClass = "", delay = 0 }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span className={`block ${lineClass}`} initial={{ y: "110%" }} animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.14 }}>
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
