import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, Skull } from "lucide-react";
import { useParrot } from "@/context/ParrotContext";
import * as sfx from "@/lib/sfx";

const CREW = ["Bloody Bhavesh", "One-Eye Ananya", "Kraken Karan", "Scurvy Sneha", "Rusty Rohan", "Hook-hand Harsh", "Ghost Gauri", "Barnacle Bunty"];

export function Boarding({ user, onDone }) {
  const { say } = useParrot();
  const [scene, setScene] = useState(0);
  const crew = useMemo(() => [user.name, ...CREW].slice(0, 9), [user.name]);

  useEffect(() => {
    sfx.thunder();
    say(`Ahoy ${user.name}! Main hoon Captain Barbossa Rao, PITR ka Pirate Captain-in-Chief. Tumhara ship aa raha hai!`);
    const t1 = setTimeout(() => { setScene(1); sfx.thunder(); say(`Ye hai Black Kraken, section ${user.section} ka jahaaz. Ye khoonkhar lootere tumhare classmates hain. Board karo!`); }, 5200);
    const t2 = setTimeout(() => onDone(), 11500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-testid="boarding-cinematic" className="fixed inset-0 z-[90] bg-black overflow-hidden">
      <AnimatePresence>
        {scene === 0 && (
          <motion.div key="captain" className="absolute inset-0 grid md:grid-cols-2 items-center" exit={{ opacity: 0, transition: { duration: 0.8 } }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,#174653_0%,#071923_60%,#000_100%)]" />
            <motion.img src="/assets/pirate_character.jpg" alt="Captain Barbossa Rao, the Pirate Captain-in-Chief" className="relative h-[60vh] md:h-[92vh] mx-auto object-contain md:order-2"
              initial={{ y: 200, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ maskImage: "radial-gradient(ellipse 48% 50% at 50% 46%, black 45%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 48% 50% at 50% 46%, black 45%, transparent 75%)" }} />
            <motion.div className="relative px-6 md:px-16 text-center md:text-left" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }}>
              <p className="eyebrow mb-4">The Pirate Captain-in-Chief speaks</p>
              <h2 className="f-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#E9D4A5] leading-tight">Ahoy, <span className="gold-text">{user.name}</span>.</h2>
              <p className="f-quote text-xl sm:text-2xl text-[#E9D4A5]/90 mt-5 max-w-md">"Discipline keeps the ship afloat. Curiosity discovers new oceans."</p>
            </motion.div>
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div key="ship" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <motion.img src="/assets/ghost_ship.jpg" alt="The Black Kraken horror pirate ship" className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.5, y: 80 }} animate={{ scale: 1.05, y: 0 }} transition={{ duration: 6, ease: "easeOut" }} />
            <div className="lightning" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
            <div className="relative h-full flex flex-col justify-end px-6 sm:px-14 pb-14">
              <p className="eyebrow mb-3 flex items-center gap-2"><Skull size={14} /> Now boarding · Section {user.section}</p>
              <h2 className="f-display font-black text-4xl sm:text-6xl text-[#E9D4A5]">The <span className="gold-text">Black Kraken</span></h2>
              <div className="mt-6 flex flex-wrap gap-2 max-w-3xl">
                {crew.map((c, i) => (
                  <motion.span key={c} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.25 }}
                    className={`f-mono text-xs px-3 py-1.5 rounded-full border ${i === 0 ? "bg-[#F2C66D] text-[#071923] border-[#F2C66D]" : "border-[#D6A64F]/50 text-[#E9D4A5] bg-black/50"}`}>
                    {i === 0 ? `★ ${c} (Deckhand)` : c}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button data-testid="boarding-skip-btn" onClick={onDone} className="absolute top-5 right-5 z-10 flex items-center gap-2 f-mono text-xs tracking-widest text-[#F2C66D] px-4 py-2 rounded-full border border-[#D6A64F]/50 bg-black/60 hover:bg-[#174653] transition-colors">
        SKIP <SkipForward size={14} />
      </button>
    </div>
  );
}
