import { Code2, BrainCircuit, Zap, Cog, Castle, Swords, ArrowUpRight } from "lucide-react";
import { TiltCard, Unroll } from "@/components/fx";
import { useParrot } from "@/context/ParrotContext";

const DEPTS = [
  { id: "cse", icon: Code2, name: "The Code Seas", dept: "Computer Science & Engineering", crew: 420, txt: "Where deckhands learn to compile cannons, debug sails and push to the main(mast) branch.", quip: "Code Seas! Yahan semicolon bhoolne pe keelhaul hota hai.", big: true },
  { id: "ai", icon: BrainCircuit, name: "Isle of Intelligent Machines", dept: "Artificial Intelligence & ML", crew: 260, txt: "Neural nets cast into the deep. Our parrots now hallucinate in 14 languages.", quip: "AI island! Mera janam yahin hua tha. Rum chori bhi yahin seekhi." },
  { id: "ee", icon: Zap, name: "Thunder Reef", dept: "Electrical & Electronics", crew: 210, txt: "Harnessing lightning from the Great Storm. Mostly for phone charging.", quip: "Thunder Reef! Kuch bhi chhuo mat, sab mein current hai." },
  { id: "me", icon: Cog, name: "Iron Anchor Forge", dept: "Mechanical Engineering", crew: 240, txt: "Cannons, gears, and engines that make the Black Kraken outrun the Navy.", quip: "Iron Anchor! Yahan ke students gear ko bhi gear mein daal dete hain." },
  { id: "ce", icon: Castle, name: "Coral Bastion", dept: "Civil Engineering", crew: 190, txt: "Sea forts, rope bridges and harbours that survive both tides and audits.", quip: "Coral Bastion! Inhone rope bridge banaya… isliye attendance kam hai." },
  { id: "hack", icon: Swords, name: "Battles of Invention", dept: "Hackathons & Innovation", crew: 36, txt: "36-hour battles. Sleep be optional, pizza be mandatory, demos be cursed.", quip: "Battles of Invention! 36 ghante, zero neend, ek demo jo live pe hi tootega." },
];

export function Islands() {
  const { laugh } = useParrot();
  return (
    <section id="islands" data-testid="islands-section" className="px-5 sm:px-10 lg:px-16 py-24 lg:py-32 bg-[#0B202C] grain relative">
      <div className="max-w-3xl mb-14">
        <p className="eyebrow mb-4">Departments · Research Islands</p>
        <h2 className="f-display font-black text-4xl sm:text-5xl text-[#E9D4A5]">Five islands. <span className="gold-text">One fleet.</span></h2>
      </div>
      <div className="grid md:grid-cols-3 md:auto-rows-[260px] gap-5">
        {DEPTS.map((d, i) => {
          const I = d.icon;
          return (
            <Unroll key={d.id} delay={i * 0.08} rod={false} className={d.big ? "md:col-span-2 md:row-span-2" : ""}>
              <TiltCard testId={`island-card-${d.id}`} onClick={() => laugh(d.quip)}
                className={`relative h-full min-h-[240px] rounded-[22px] p-7 flex flex-col justify-between overflow-hidden cursor-pointer border border-[#D6A64F]/25 transition-colors hover:border-[#F2C66D]/70 ${d.big ? "bg-[linear-gradient(140deg,#174653,#0B202C_70%)]" : "bg-[#071923]"}`}>
                {d.big && <img src="/assets/hod_cs.jpg" alt="" aria-hidden className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-25 [mask-image:linear-gradient(to_left,black,transparent)]" />}
                <div className="relative flex items-start justify-between">
                  <span className="w-12 h-12 rounded-xl grid place-items-center bg-[#D6A64F]/15 border border-[#D6A64F]/40 text-[#F2C66D]"><I size={22} /></span>
                  <ArrowUpRight className="text-[#D6A64F]" />
                </div>
                <div className="relative">
                  <p className="f-mono text-[11px] uppercase tracking-widest text-[#E9D4A5]/75">{d.dept}</p>
                  <h3 className={`f-display font-bold text-[#E9D4A5] mt-1 ${d.big ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl"}`}>{d.name}</h3>
                  <p className={`text-[#E9D4A5]/80 mt-2 ${d.big ? "text-base sm:text-lg max-w-md" : "text-sm"}`}>{d.txt}</p>
                  <p className="f-mono text-xs text-[#4DF0D1] mt-3">{d.crew} crew aboard</p>
                </div>
              </TiltCard>
            </Unroll>
          );
        })}
      </div>
    </section>
  );
}
