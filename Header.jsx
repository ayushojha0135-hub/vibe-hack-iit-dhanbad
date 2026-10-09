import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Crown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { AmbienceToggle } from "@/components/AmbienceToggle";
import { useAuth } from "@/context/AuthContext";
import { useParrot } from "@/context/ParrotContext";
import { scrollToId, pick } from "@/lib/api";

export const NAV = [
  ["map", "Map"], ["voyage", "Voyage"], ["council", "Council"], ["islands", "Islands"], ["vault", "Vault"], ["fleet", "Fleet"],
];
const BROKEN = ["Gaharaha ha! Ye link doob chuka hai matey!", "Arrr! Alumni Cove ka link kraken kha gaya. 404 — Davy Jones' Locker!", "Ha ha ha! Is link pe click karke kya mila? Sirf paani!"];

export function Header() {
  const { user, logout } = useAuth();
  const { laugh, say } = useParrot();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header data-testid="site-header" className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${scrolled ? "bg-[#071923]/85 backdrop-blur-xl border-b border-[#D6A64F]/30" : "bg-transparent"}`}>
      <div className="flex items-center justify-between gap-4 px-5 lg:px-10 h-16">
        <button data-testid="header-logo" onClick={() => scrollToId("hero")} aria-label="PITR home"><Logo /></button>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(([id, l]) => (
            <button key={id} data-testid={`nav-${id}`} onClick={() => { scrollToId(id); say(`Sailing to ${l}! Hold yer hats, matey.`, { voice: false }); }}
              className="px-4 py-2 f-display text-[12px] font-bold tracking-[0.18em] text-[#E9D4A5] hover:text-[#F2C66D] transition-colors uppercase">{l}</button>
          ))}
          <button data-testid="nav-broken-alumni" onClick={() => laugh(pick(BROKEN))} className="px-4 py-2 f-display text-[12px] font-bold tracking-[0.18em] text-[#E9D4A5]/70 hover:text-[#B91C1C] transition-colors uppercase line-through decoration-[#B91C1C]/60">Alumni Cove</button>
        </nav>
        <div className="flex items-center gap-3">
          {user?.role === "captain" && (
            <button data-testid="nav-captain-quarters" onClick={() => { say("Captain ke quarters khul rahe hain. Crew, salute!", { voice: false }); nav("/captain"); }}
              className="flex items-center gap-2 h-10 px-4 rounded-full bg-[#D6A64F] text-[#071923] f-display text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-[#F2C66D] transition-colors">
              <Crown size={14} /><span className="hidden md:inline">Captain's Quarters</span>
            </button>
          )}
          <AmbienceToggle compact />
          <span data-testid="header-user-name" className="hidden sm:block text-right leading-tight">
            <span className="block text-sm text-[#F2C66D] font-medium">{user?.name}</span>
            <span className="block f-mono text-[11px] text-[#E9D4A5]/75 uppercase">{user?.role === "captain" ? "Captain" : "Deckhand"} · {user?.section}</span>
          </span>
          <button data-testid="logout-btn" onClick={() => { say("Ship chhod rahe ho? Phir milenge, matey!", { voice: false }); logout(); }} aria-label="Log out"
            className="w-10 h-10 grid place-items-center rounded-full border border-[#D6A64F]/45 text-[#F2C66D] hover:bg-[#174653] transition-colors"><LogOut size={16} /></button>
        </div>
      </div>
    </header>
  );
}
