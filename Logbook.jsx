import { toast } from "sonner";
import { ChestModal, CannonButton } from "@/components/fx";
import { useAuth } from "@/context/AuthContext";
import { useParrot } from "@/context/ParrotContext";
import { pick } from "@/lib/api";

const MISSIONS = [
  { id: "m1", t: "Compiler Design — Lexing the Kraken's Tongue", due: "Fri, 11:59 PM", w: "Prof. Salty Knuth" },
  { id: "m2", t: "DBMS — Normalise the Treasure Ledger to 3NF", due: "Mon, 09:00 AM", w: "Mistress Codd-Morgan" },
  { id: "m3", t: "Neural Nets — Teach the Parrot to Stop Stealing Rum", due: "Wed, 05:00 PM", w: "Admiral Hinton Hook" },
];
const HOVER = ["Arrr! Padhai karle pehle!", "Submit? Abhi toh copy bhi nahi ki, matey!", "Gaharaha! Deadline se pehle submit? Ye toh chamatkar hai!"];

export function Logbook({ open, onClose }) {
  const { user } = useAuth();
  const { laugh, say } = useParrot();
  const att = 76;
  return (
    <ChestModal open={open} onClose={onClose} title="The Captain's Logbook" eyebrow={`Crew record · ${user?.section || ""}`} testId="logbook-modal">
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[["Attendance (Rope Bridge)", `${att}%`, "Bridge barely holds"], ["Doubloons (CGPA)", "8.4", "Top 20% of crew"], ["Cargo Missions", "3 due", "Kraken waits for none"]].map(([l, v, s]) => (
          <div key={l} className="rounded-xl p-4 bg-[#174653]/40 border border-[#D6A64F]/25">
            <p className="f-mono text-[11px] uppercase tracking-wider text-[#E9D4A5]/80">{l}</p>
            <p className="f-display text-3xl font-bold text-[#F2C66D] mt-1">{v}</p>
            <p className="text-xs text-[#E9D4A5]/75 mt-1">{s}</p>
          </div>
        ))}
      </div>
      <div className="h-2 rounded-full bg-[#071923] overflow-hidden mb-7"><div className="h-full bg-gradient-to-r from-[#B91C1C] via-[#D6A64F] to-[#4DF0D1]" style={{ width: `${att}%` }} /></div>
      <p className="eyebrow mb-3">Pending Cargo Missions</p>
      <ul className="space-y-3">
        {MISSIONS.map((m) => (
          <li key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-xl p-4 border border-[#D6A64F]/20 bg-[#0B202C]">
            <div>
              <p className="text-[#E9D4A5] font-medium">{m.t}</p>
              <p className="f-mono text-xs text-[#E9D4A5]/70 mt-1">{m.w} · due {m.due}</p>
            </div>
            <span onMouseEnter={() => laugh(pick(HOVER))}>
              <CannonButton testId={`submit-assignment-${m.id}`} className="!py-2.5 !px-4 !text-[11px]"
                onClick={() => { toast.success("Cargo Mission delivered!", { description: m.t }); say("Boom! Cargo mission submit ho gaya. Professor ab plagiarism cannon chalayenge."); }}>
                Submit Assignment
              </CannonButton>
            </span>
          </li>
        ))}
      </ul>
    </ChestModal>
  );
}
