import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Unroll } from "@/components/fx";
import { useParrot } from "@/context/ParrotContext";

const COUNCIL = [
  { id: "captain", img: "captain_chief", name: "Capt. Barbossa Rao", role: "Pirate Captain-in-Chief", sub: "Principal", quote: "Discipline keeps the ship afloat. Curiosity discovers new oceans.", stats: [["Years at sea", "41"], ["Papers plundered", "212"], ["Students made to walk plank", "0 (officially)"], ["Rum level", "Classified"]] },
  { id: "firstmate", img: "first_mate", name: "Mira Blackwake", role: "First Mate of the Fleet", sub: "Vice Principal", quote: "A late assignment is a mutiny. I crush mutinies before breakfast.", stats: [["Mutinies stopped", "37"], ["Timetables drafted", "1,204"], ["Smiles per semester", "2"], ["Compass accuracy", "99.9%"]] },
  { id: "hodcs", img: "hod_cs", name: "Capt. Zara Stacktrace", role: "Captain of the Code Seas", sub: "HOD, Computer Science", quote: "Bugs fear me. Deadlines do not. Unfortunately, neither does my compiler.", stats: [["Bugs slain", "9,001"], ["Languages spoken", "14 + Parrot"], ["Coffee : Rum", "3 : 1"], ["Prod outages caused", "We don't talk about it"]] },
  { id: "hodai", img: "hod_ai", name: "Adm. Vikram Neuralbeard", role: "Admiral of Intelligent Machines", sub: "HOD, Artificial Intelligence", quote: "My parrot is now an AI. It still steals my rum.", stats: [["Models trained", "300+"], ["GPUs plundered", "64"], ["Parrot accuracy", "97% (sarcasm)"], ["Rum stolen by AI", "∞"]] },
];

function FlipCard({ c }) {
  const [f, setF] = useState(false);
  const { say } = useParrot();
  const toggle = () => { setF(!f); if (!f) say(`${c.name}, ${c.role}. Kehte hain: ${c.quote}`); };
  return (
    <div className={`flip h-[480px] ${f ? "is-flipped" : ""}`}>
      <button data-testid={`council-card-${c.id}`} onClick={toggle} className="flip-inner w-full h-full text-left" aria-label={`Flip ${c.name}`}>
        <div className="flip-face rounded-[22px] overflow-hidden brass-border bg-[#0B202C]">
          <img src={`/assets/${c.img}.jpg`} alt={`${c.name}, ${c.role}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071923] via-[#071923]/40 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <p className="eyebrow text-[11px]">{c.sub}</p>
            <p className="f-display font-bold text-2xl text-[#E9D4A5] mt-1">{c.name}</p>
            <p className="text-[#F2C66D] text-sm">{c.role}</p>
            <p className="f-quote text-[#E9D4A5]/90 mt-3 leading-snug">"{c.quote}"</p>
            <span className="mt-4 inline-flex items-center gap-2 f-mono text-[11px] text-[#E9D4A5]/80"><RotateCw size={12} /> tap to reveal stats</span>
          </div>
        </div>
        <div className="flip-face flip-back rounded-[22px] parchment p-7 flex flex-col">
          <p className="eyebrow !text-[#7a3b12]">Wanted · Dead or Tenured</p>
          <p className="f-display font-black text-2xl text-[#2A2016] mt-2">{c.name}</p>
          <p className="f-quote text-[#5a3d16]">{c.role}</p>
          <dl className="mt-6 space-y-3 flex-1">
            {c.stats.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-dashed border-[#5a3d16]/35 pb-2">
                <dt className="text-sm text-[#2A2016]">{k}</dt><dd className="f-display font-bold text-[#7a3b12] text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="f-mono text-[11px] text-[#5a3d16]">Reward: 10,000 doubloons for a bug-free semester</p>
        </div>
      </button>
    </div>
  );
}

export function Council() {
  return (
    <section id="council" data-testid="council-section" className="px-5 sm:px-10 lg:px-16 py-24 lg:py-32 bg-[#071923]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
        <div>
          <p className="eyebrow mb-4">Leadership · The Captain's Council</p>
          <h2 className="f-display font-black text-4xl sm:text-5xl text-[#E9D4A5]">The ones who <span className="gold-text">steer the ship</span></h2>
        </div>
        <p className="text-[#E9D4A5]/85 max-w-md">Hamare Masters of Knowledge. Card pe click karo — unke raaz (aur stats) khul jaayenge.</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {COUNCIL.map((c, i) => <Unroll key={c.id} delay={i * 0.12} rod={false}><FlipCard c={c} /></Unroll>)}
      </div>
    </section>
  );
}
