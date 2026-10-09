import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { CannonButton, CompassCursor, MaskLines } from "@/components/fx";
import { Logbook } from "@/sections/Logbook";
import { useParrot } from "@/context/ParrotContext";
import { useAuth } from "@/context/AuthContext";
import { scrollToId } from "@/lib/api";
import * as sfx from "@/lib/sfx";

const Bird = ({ top, dur, delay, s = 1 }) => (
  <svg className="bird" style={{ top, animationDuration: `${dur}s`, animationDelay: `${delay}s`, transform: `scale(${s})` }} width="34" height="14" viewBox="0 0 34 14" aria-hidden>
    <path d="M1 7 Q9 0 17 7 Q25 0 33 7" stroke="#cfd8dc" strokeOpacity=".7" strokeWidth="1.6" fill="none" />
  </svg>
);

export function Hero() {
  const ref = useRef(null);
  const { user } = useAuth();
  const { say } = useParrot();
  const [log, setLog] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 60, damping: 15 });
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 60, damping: 15 });

  useEffect(() => {
    const t = setTimeout(() => { sfx.squawk(); say(`Squawk! Welcome aboard ${user?.name || "matey"}! Main hoon Kraken-Byte, tumhara AI tota. Neeche scroll karo, poora semester ka safar dikhata hoon!`); }, 1800);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="hero" ref={ref} data-testid="hero-section" className="compass-scope relative h-[100svh] min-h-[640px] overflow-hidden bg-[#071923]"
      onMouseMove={(e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); }}>
      <motion.div className="absolute inset-0" style={{ y, scale, rotateX: rX, rotateY: rY, transformPerspective: 1200 }}>
        <img src="/assets/hero_ship.jpg" alt="Black-sailed pirate galleon sailing through a foggy night sea" className="w-full h-full object-cover object-[70%_50%]" />
        <span className="lantern" style={{ left: "62%", top: "64%" }} />
        <span className="lantern" style={{ left: "71%", top: "66%", animationDelay: ".7s" }} />
        <span className="lantern" style={{ left: "80%", top: "62%", animationDelay: "1.3s" }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#071923] via-[#071923]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071923] via-transparent to-[#071923]/50" />
      <div className="fog" /><div className="fog two" />
      <Bird top="18%" dur={22} delay={0} /><Bird top="26%" dur={28} delay={6} s={0.7} /><Bird top="12%" dur={34} delay={12} s={0.85} />

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 lg:px-16 pt-16">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="eyebrow mb-6">Pirate Institute of Technology &amp; Research · Since 1717</motion.p>
        <h1 className="f-display font-black leading-[0.9] text-[13vw] sm:text-7xl lg:text-[8.5rem] text-[#E9D4A5] tracking-tight">
          <MaskLines lines={["Welcome", "aboard,"]} delay={0.2} />
          <MaskLines lines={["matey!"]} lineClass="gold-text" delay={0.5} />
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }}
          className="f-quote text-xl sm:text-2xl text-[#E9D4A5]/90 mt-7 max-w-xl leading-snug">
          "Where knowledge be the greatest treasure, and attendance be the greatest enemy."
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.9 }} className="mt-10 flex flex-wrap gap-4">
          <CannonButton testId="hero-explore-campus-btn" onClick={() => { say("Campus ka naksha khul raha hai! Kisi bhi island pe click karo."); setTimeout(() => scrollToId("map"), 350); }}>Explore the Campus</CannonButton>
          <CannonButton testId="hero-enter-logbook-btn" variant="ghost" onClick={() => setLog(true)}>Enter the Logbook</CannonButton>
        </motion.div>
        <div className="mt-14 hidden sm:flex gap-10 f-mono text-xs text-[#E9D4A5]/80">
          {[["1,717", "Crew aboard"], ["5", "Research Islands"], ["94%", "Fortune Fleet hire rate"], ["0", "Rum left"]].map(([n, l]) => (
            <div key={l}><span className="block f-display text-2xl text-[#F2C66D] font-bold">{n}</span>{l}</div>
          ))}
        </div>
      </motion.div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 f-mono text-[11px] tracking-[0.3em] text-[#E9D4A5]/70 hidden md:block">SCROLL TO SET SAIL ↓</div>
      <CompassCursor scopeRef={ref} />
      <Logbook open={log} onClose={() => setLog(false)} />
    </section>
  );
}
