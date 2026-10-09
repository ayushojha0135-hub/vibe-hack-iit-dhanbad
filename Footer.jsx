import { Logo } from "@/components/Logo";
import { useParrot } from "@/context/ParrotContext";
import { scrollToId, pick } from "@/lib/api";

const BROKEN = ["Gaharaha ha! Ye link doob chuka hai matey!", "Arrr! Ye page Davy Jones' Locker mein hai. 404 fathoms neeche!", "Ha ha! Fee refund ka link? Woh toh kabhi tha hi nahi!"];
const COLS = [
  ["The Ship", [["Treasure Map", "map"], ["Semester Voyage", "voyage"], ["Captain's Council", "council"]]],
  ["The Crew", [["Research Islands", "islands"], ["Grand Treasure Vault", "vault"], ["Fortune Fleet", "fleet"]]],
  ["Lost at Sea", [["Fee Refund Portal", null], ["Alumni Cove", null], ["Canteen Menu 2019", null]]],
];

export function Footer() {
  const { laugh } = useParrot();
  return (
    <footer data-testid="site-footer" className="relative px-5 sm:px-10 lg:px-16 pt-24 pb-32 md:pb-16 bg-[#04121a] border-t border-[#D6A64F]/25 overflow-hidden">
      <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <Logo />
          <p className="f-quote text-xl text-[#E9D4A5]/90 mt-6 max-w-sm">"Where knowledge be the greatest treasure, and attendance be the greatest enemy."</p>
          <p className="f-mono text-xs text-[#E9D4A5]/70 mt-6">Skull Cove, Kraken Bay · Est. 1717 · Servers powered by kraken-blood</p>
        </div>
        {COLS.map(([h, links]) => (
          <div key={h}>
            <p className="eyebrow mb-4">{h}</p>
            <ul className="space-y-3">
              {links.map(([l, id]) => (
                <li key={l}>
                  <button data-testid={`footer-link-${l.toLowerCase().replace(/[^a-z]+/g, "-")}`} onClick={() => (id ? scrollToId(id) : laugh(pick(BROKEN)))}
                    className="text-[#E9D4A5]/85 hover:text-[#F2C66D] transition-colors text-left">{l}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p aria-hidden className="f-display font-black text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(214,166,79,.25)] mt-16 -mb-[6vw] select-none">PITR</p>
      <p className="f-mono text-xs text-[#E9D4A5]/70 mt-6">© 2026 Pirate Institute of Technology &amp; Research · A hackathon reimagining · No parrots were harmed.</p>
    </footer>
  );
}
