import { Map, Ship, Users, Library, Anchor } from "lucide-react";
import { scrollToId } from "@/lib/api";

const ITEMS = [["map", Map, "Map"], ["voyage", Ship, "Voyage"], [null], ["vault", Library, "Vault"], ["fleet", Anchor, "Fleet"]];

export function MobileNav() {
  return (
    <nav data-testid="mobile-bottom-nav" className="md:hidden fixed bottom-0 inset-x-0 z-[60] h-[68px] bg-[#071923]/92 backdrop-blur-xl border-t border-[#D6A64F]/35 grid grid-cols-5">
      {ITEMS.map(([id, I, l], i) => (id ? (
        <button key={id} data-testid={`mobile-nav-${id}`} onClick={() => scrollToId(id)} className="flex flex-col items-center justify-center gap-1 text-[#E9D4A5] active:text-[#F2C66D]">
          <I size={19} /><span className="f-mono text-[10px] tracking-wider uppercase">{l}</span>
        </button>
      ) : <span key={`gap-${i}`} aria-hidden className="relative"><Users className="hidden" /></span>))}
    </nav>
  );
}
