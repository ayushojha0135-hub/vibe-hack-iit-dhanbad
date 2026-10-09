import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Pin } from "lucide-react";
import { Unroll, TiltCard } from "@/components/fx";
import { http } from "@/lib/api";

const TRIALS = [["Data Structures of the Deep", "14 Oct", "Hall of Cannons"], ["Digital Logic & Lightning", "16 Oct", "Thunder Reef Deck"], ["Discrete Maths of Navigation", "18 Oct", "Captain's Keep"], ["Operating Systems of the Kraken", "21 Oct", "Lower Deck B"]];

function Count({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return undefined;
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

export function Fleet() {
  const [notices, setNotices] = useState([]);
  useEffect(() => {
    http.get("/notices").then((r) => setNotices(Array.isArray(r.data) ? r.data : [])).catch(() => setNotices([]));
  }, []);
  return (
    <section id="fleet" data-testid="fleet-section" className="px-5 sm:px-10 lg:px-16 py-24 lg:py-32 bg-[#0B202C]">
      <p className="eyebrow mb-4">Placements · The Fortune Fleet</p>
      <h2 className="f-display font-black text-4xl sm:text-5xl text-[#E9D4A5] mb-12">Where crews <span className="gold-text">get hired</span></h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        {[[94, "%", "Crew hired"], [48, " LPA", "Highest bounty"], [312, "", "Merchant navies"], [1717, "", "Alumni captains"]].map(([n, s, l], i) => (
          <TiltCard key={l} testId={`fleet-stat-${i}`} className="rounded-[20px] p-6 bg-[#071923] border border-[#D6A64F]/25">
            <p className="f-display font-black text-3xl sm:text-5xl text-[#F2C66D]"><Count to={n} suffix={s} /></p>
            <p className="text-sm text-[#E9D4A5]/85 mt-2">{l}</p>
          </TiltCard>
        ))}
      </div>
      <div id="trials" className="grid lg:grid-cols-2 gap-10">
        <div>
          <p className="eyebrow mb-4">Examinations · Trials of the Seven Seas</p>
          <div className="rounded-[20px] overflow-hidden border border-[#D6A64F]/25" data-testid="trials-table">
            {TRIALS.map(([s, d, v], i) => (
              <div key={s} className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 ${i % 2 ? "bg-[#071923]" : "bg-[#0e2733]"}`}>
                <span className="text-[#E9D4A5]">{s}</span>
                <span className="f-mono text-sm text-[#F2C66D]">{d}</span>
                <span className="hidden sm:block f-mono text-xs text-[#E9D4A5]/75 self-center">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4">Notice Board · Nailed to the Mast</p>
          <Unroll>
            <div data-testid="notice-board" className="parchment rounded-[20px] p-6 sm:p-8 space-y-4">
              {notices.length === 0 && <p className="f-quote text-[#2A2016]">Koi notice nahi. Shanti hai… shak hota hai.</p>}
              {notices.map((n) => (
                <div key={n.id} data-testid={`notice-${n.id}`} className="flex gap-4 items-start border-b border-dashed border-[#5a3d16]/35 pb-4 last:border-0 last:pb-0">
                  <Pin size={16} className="text-[#B91C1C] mt-1 shrink-0" />
                  <div className="flex-1">
                    <span className="f-mono text-[11px] font-semibold text-[#7a3b12] tracking-widest">{n.tag} · {n.date}</span>
                    <p className="text-[#2A2016] mt-1 leading-snug">{n.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </Unroll>
        </div>
      </div>
    </section>
  );
}
