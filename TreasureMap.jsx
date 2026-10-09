import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Navigation } from "lucide-react";
import { Unroll } from "@/components/fx";
import { useParrot } from "@/context/ParrotContext";
import { scrollToId } from "@/lib/api";
import * as sfx from "@/lib/sfx";

export const ISLANDS = [
  { id: "hero", name: "Main Harbor", x: 130, y: 400, d: "M80 400 q20-50 70-40 q50 10 40 50 q-20 40-70 30 q-50-5-40-40z", quip: "Wapas Main Harbor? Ghar ki yaad aa gayi kya, deckhand?" },
  { id: "voyage", name: "Semester Strait", x: 330, y: 250, d: "M280 250 q30-60 90-30 q40 30 0 70 q-50 30-90-40z", quip: "Semester Strait! Yahan toofan, barish aur exams sab milenge. Gaharaha!" },
  { id: "council", name: "Captain's Keep", x: 520, y: 120, d: "M470 120 q40-50 90-20 q30 40-20 60 q-60 20-70-40z", quip: "Captain's Keep! Dhyaan se, Captain-in-Chief ka mood aaj kharab hai." },
  { id: "islands", name: "Knowledge Islands", x: 560, y: 360, d: "M500 360 q30-70 110-40 q50 40 0 80 q-70 40-110-40z", quip: "Ah, the Engineering Bay! Mind the explosions!" },
  { id: "vault", name: "Treasure Vault Isle", x: 790, y: 190, d: "M740 190 q40-60 100-20 q30 50-30 70 q-60 10-70-50z", quip: "Grand Treasure Vault! Kitaabein bhi hain aur sone ke sikke bhi. Mostly kitaabein." },
  { id: "fleet", name: "Fortune Fleet Bay", x: 850, y: 430, d: "M790 430 q40-50 110-20 q30 50-40 60 q-60 10-70-40z", quip: "Fortune Fleet! Placement ke jahaaz yahan rukte hain. Resume chamka lo!" },
];

function SeaMap() {
  const { say } = useParrot();
  const [ship, setShip] = useState({ x: 130, y: 400 });
  const [route, setRoute] = useState(null);
  const pathRef = useRef(null);
  const busy = useRef(false);

  const sail = (isl) => {
    if (busy.current) return;
    busy.current = true;
    const cx = (ship.x + isl.x) / 2 + (isl.y - ship.y) * 0.3, cy = (ship.y + isl.y) / 2 - (isl.x - ship.x) * 0.3;
    setRoute({ d: `M${ship.x} ${ship.y} Q${cx} ${cy} ${isl.x} ${isl.y}`, key: Date.now() });
    sfx.squawk();
    say(isl.quip, { mood: "laugh" });
    requestAnimationFrame(() => {
      const p = pathRef.current;
      if (!p) { busy.current = false; return; }
      const len = p.getTotalLength(), start = performance.now(), dur = 1500;
      const step = (now) => {
        const k = Math.min(1, (now - start) / dur);
        const pt = p.getPointAtLength(len * (1 - Math.pow(1 - k, 3)));
        setShip({ x: pt.x, y: pt.y });
        if (k < 1) requestAnimationFrame(step);
        else { busy.current = false; setTimeout(() => scrollToId(isl.id), 300); }
      };
      requestAnimationFrame(step);
    });
  };

  return (
    <div className="relative rounded-[28px] overflow-hidden parchment brass-border">
      <svg viewBox="0 0 1000 540" className="w-full h-auto block" data-testid="treasure-map-svg">
        <defs>
          <pattern id="waves" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 q10-8 20 0 t20 0" stroke="#7a5a2a" strokeOpacity=".18" fill="none" /></pattern>
          <mask id="routeMask"><motion.path key={route?.key} d={route?.d || ""} stroke="#fff" strokeWidth="12" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }} /></mask>
        </defs>
        <rect width="1000" height="540" fill="url(#waves)" />
        <g opacity=".35" stroke="#5a3d16" fill="none"><circle cx="900" cy="90" r="60" /><circle cx="900" cy="90" r="40" strokeDasharray="3 5" />
          {[0, 45, 90, 135].map((a) => <line key={a} x1="900" y1="20" x2="900" y2="160" transform={`rotate(${a} 900 90)`} />)}</g>
        <text x="900" y="18" textAnchor="middle" className="f-display" fontSize="16" fill="#5a3d16">N</text>
        {route && <path ref={pathRef} d={route.d} stroke="#B91C1C" strokeWidth="3.5" strokeDasharray="2 10" strokeLinecap="round" fill="none" mask="url(#routeMask)" />}
        {ISLANDS.map((i) => (
          <g key={i.id} data-testid={`map-island-${i.id}`} onClick={() => sail(i)} className="cursor-pointer group outline-none" role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && sail(i)}>
            <path d={i.d} fill="#c9a86a" stroke="#5a3d16" strokeWidth="2" className="transition-[fill] duration-300 group-hover:fill-[#D6A64F]" />
            <path d={i.d} fill="none" stroke="#5a3d16" strokeOpacity=".3" strokeWidth="8" transform={`translate(0 4)`} />
            <circle cx={i.x} cy={i.y} r="5" fill="#B91C1C" />
            <text x={i.x} y={i.y + 58} textAnchor="middle" fontSize="19" fill="#2A2016" className="f-display" fontWeight="700">{i.name}</text>
          </g>
        ))}
        <g transform={`translate(${ship.x - 18} ${ship.y - 36})`} pointerEvents="none">
          <path d="M4 26 L32 26 L28 34 L8 34Z" fill="#2A2016" /><line x1="18" y1="4" x2="18" y2="26" stroke="#2A2016" strokeWidth="2" />
          <path d="M18 5 L30 18 L18 22Z" fill="#071923" /><path d="M18 2 L26 4 L18 7Z" fill="#B91C1C" />
        </g>
        <text x="40" y="510" fontSize="16" fill="#5a3d16" className="f-quote" fontStyle="italic">Here be dragons (and the Exam Cell)</text>
      </svg>
    </div>
  );
}

function SwipeCompass() {
  const { say } = useParrot();
  const [idx, setIdx] = useState(0);
  const scroller = useRef(null);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setIdx(Math.min(ISLANDS.length - 1, Math.round(el.scrollLeft / (el.clientWidth * 0.82 + 16))));
  };
  const cur = ISLANDS[Math.min(idx, ISLANDS.length - 1)];
  return (
    <div data-testid="mobile-compass" className="md:hidden">
      <div className="grid place-items-center mb-6">
        <div className="relative w-48 h-48 rounded-full parchment brass-border grid place-items-center">
          <Compass className="absolute text-[#5a3d16]/30" size={170} strokeWidth={0.6} />
          <motion.div animate={{ rotate: idx * 60 }} transition={{ type: "spring", stiffness: 80, damping: 10 }}>
            <Navigation size={64} className="text-[#B91C1C] fill-[#B91C1C]" />
          </motion.div>
        </div>
        <p className="f-display text-[#F2C66D] mt-4 text-lg">{cur.name}</p>
      </div>
      <div ref={scroller} onScroll={onScroll} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-5 px-5">
        {ISLANDS.map((i) => (
          <div key={i.id} className="snap-center shrink-0 w-[82%] rounded-2xl p-5 bg-[#174653]/50 border border-[#D6A64F]/30">
            <p className="eyebrow">Destination</p>
            <p className="f-display text-xl text-[#E9D4A5] mt-1">{i.name}</p>
            <p className="f-quote text-[#E9D4A5]/85 mt-2">{i.quip}</p>
            <button data-testid={`compass-sail-${i.id}`} onClick={() => { sfx.squawk(); say(i.quip, { mood: "laugh" }); scrollToId(i.id); }}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#D6A64F] text-[#071923] f-display text-xs font-bold tracking-widest">Sail Here</button>
          </div>
        ))}
      </div>
      <p className="text-center f-mono text-[11px] text-[#E9D4A5]/70 mt-3">← swipe the compass →</p>
    </div>
  );
}

export function TreasureMap() {
  return (
    <section id="map" data-testid="treasure-map-section" className="relative px-5 sm:px-10 lg:px-16 py-24 lg:py-32 bg-[#071923]">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-end mb-12">
        <div>
          <p className="eyebrow mb-4">Navigation · No boring menus here</p>
          <h2 className="f-display font-black text-4xl sm:text-5xl text-[#E9D4A5] leading-[1.05]">The <span className="gold-text">Treasure Map</span> of Campus</h2>
        </div>
        <p className="text-[#E9D4A5]/85 text-base sm:text-lg max-w-xl">Kisi bhi island pe click karo. Hamara jahaaz laal dotted raaste pe wahan sail karega, aur tota apni raay dega — chahe aapko chahiye ho ya nahi.</p>
      </div>
      <div className="hidden md:block"><Unroll><SeaMap /></Unroll></div>
      <SwipeCompass />
    </section>
  );
}
