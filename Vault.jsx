import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Coins } from "lucide-react";
import { toast } from "sonner";
import { ChestModal, CannonButton, coinBurst, Unroll } from "@/components/fx";
import { useParrot } from "@/context/ParrotContext";
import { http, errMsg } from "@/lib/api";

function Spine({ b, saved, onOpen }) {
  const h = 180 + (b.title.length % 5) * 14;
  return (
    <motion.button data-testid={`vault-book-${b.id}`} onClick={onOpen} whileHover={{ y: -14 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="relative shrink-0 w-14 sm:w-[72px] rounded-t-md rounded-b-sm flex items-center justify-center shadow-[inset_-4px_0_8px_rgba(0,0,0,.4),inset_3px_0_4px_rgba(255,255,255,.1)]"
      style={{ height: h, background: `linear-gradient(90deg, ${b.color}, ${b.color}cc 60%, #00000055)` }} aria-label={b.title}>
      <span className="absolute top-3 inset-x-2 h-px bg-[#D6A64F]/70" /><span className="absolute bottom-3 inset-x-2 h-px bg-[#D6A64F]/70" />
      <span className="f-display text-[12px] font-bold text-[#F2C66D] [writing-mode:vertical-rl] rotate-180 px-1 max-h-[82%] overflow-hidden leading-tight">{b.title}</span>
      {saved && <Coins size={14} className="absolute -top-5 text-[#F2C66D]" />}
    </motion.button>
  );
}

const DUST = ["#3a2a1a", "#2b2f2a", "#3b1f1f", "#26323a", "#3a331c", "#2e2238"];
function Props({ i }) {
  return (
    <div aria-hidden className="hidden md:flex items-end gap-2 flex-1 justify-end opacity-80">
      {DUST.map((c, k) => <span key={k} className="w-10 rounded-t-sm" style={{ height: 150 + ((k + i) % 4) * 18, background: `linear-gradient(90deg, ${c}, #00000080)` }} />)}
      <span className="w-24 h-20 rounded-t-full bg-[radial-gradient(circle_at_40%_35%,#D6A64F,#5a3d16)] mx-3" />
      {i === 0 ? (
        <span className="relative w-6 h-28 rounded-sm bg-[#E9D4A5] mx-2"><span className="lantern" style={{ left: 7, top: -14, width: 8, height: 12, borderRadius: "50% 50% 40% 40%" }} /></span>
      ) : (
        <span className="w-28 h-16 rounded-md bg-[linear-gradient(180deg,#8a5a22,#3a2210)] border border-[#D6A64F]/60" />
      )}
    </div>
  );
}

export function Vault() {
  const { say, laugh } = useParrot();
  const [q, setQ] = useState("");
  const [books, setBooks] = useState([]);
  const [saved, setSaved] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      http.get("/books", { params: { q } }).then((r) => setBooks(Array.isArray(r.data) ? r.data : [])).catch(() => setBooks([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    http.get("/books/saved").then((r) => setSaved(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  const toggle = async (e, b) => {
    const x = e.clientX, y = e.clientY;
    try {
      const { data } = await http.post(`/books/${b.id}/save`);
      setSaved((s) => (data.saved ? [...s, b.id] : s.filter((i) => i !== b.id)));
      if (data.saved) { coinBurst(x, y); toast.success("Scroll saved to yer chest!", { description: b.title }); say(`Kaching! ${b.title} tumhare khazane mein save ho gayi.`); }
      else say("Scroll waapas shelf pe. Sikke gaye paani mein.");
    } catch (err) { toast.error(errMsg(err)); }
  };

  const rows = [books.slice(0, Math.ceil(books.length / 2)), books.slice(Math.ceil(books.length / 2))];
  return (
    <section id="vault" data-testid="vault-section" className="relative px-5 sm:px-10 lg:px-16 py-24 lg:py-32 bg-[#071923] overflow-hidden">
      <img src="/assets/library_vault.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071923] via-[#071923]/80 to-[#071923]" />
      <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-12">
        <div>
          <p className="eyebrow mb-4">Library · The Grand Treasure Vault</p>
          <h2 className="f-display font-black text-4xl sm:text-5xl text-[#E9D4A5]">12,000 scrolls. <span className="gold-text">Some cursed.</span></h2>
        </div>
        <div data-testid="vault-saved-count" className="flex items-center gap-3 rounded-full px-5 py-3 brass-border bg-[#0B202C]">
          <Coins className="text-[#F2C66D]" /><span className="f-display font-bold text-[#F2C66D] text-xl">{saved.length}</span><span className="text-sm text-[#E9D4A5]/85">scrolls in yer chest</span>
        </div>
      </div>
      <div className="relative max-w-2xl mb-12">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D6A64F]" size={20} />
        <input data-testid="vault-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the Forbidden Scrolls..."
          onFocus={() => say("Forbidden Scrolls dhoondh rahe ho? Regex wali mat kholna, cursed hai!", { voice: false })}
          className="w-full rounded-full bg-[#0B202C]/90 border border-[#D6A64F]/45 pl-14 pr-5 py-4 text-[#E9D4A5] placeholder:text-[#E9D4A5]/50 f-quote text-lg outline-none focus:border-[#F2C66D] focus:shadow-[0_0_0_5px_rgba(242,198,109,.12)] transition-shadow" />
      </div>
      <Unroll>
        <div className="relative rounded-[22px] wood p-5 sm:p-8 brass-border">
          {books.length === 0 && <p data-testid="vault-empty" className="f-quote text-[#E9D4A5] text-lg py-10 text-center">Koi scroll nahi mila. Shayad kraken padh raha hai.</p>}
          {rows.map((r, i) => r.length > 0 && (
            <div key={i} className="mb-6 last:mb-0">
              <div className="flex items-end gap-2 sm:gap-3 overflow-x-auto no-scrollbar pt-6 px-2">
                {r.map((b) => <Spine key={b.id} b={b} saved={saved.includes(b.id)} onOpen={() => setOpen(b)} />)}
                <Props i={i} />
              </div>
              <div className="shelf-plank" />
            </div>
          ))}
        </div>
      </Unroll>
      <ChestModal open={!!open} onClose={() => setOpen(null)} title={open?.title} eyebrow={`${open?.island || ""} · Anno ${open?.year || ""}`} testId="book-modal">
        {open && (
          <div>
            <p className="f-quote text-xl text-[#E9D4A5]">by {open.author}</p>
            <p className="mt-4 text-[#E9D4A5]/85">Ek purana scroll jo {open.island} ke Masters of Knowledge ne likha. Padhne se pehle haath dho lo — aur apna ego bhi.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <CannonButton testId="book-save-btn" onClick={(e) => toggle(e, open)}>{saved.includes(open.id) ? "Remove from Chest" : "Save to Chest"}</CannonButton>
              <CannonButton testId="book-download-btn" variant="ghost" onClick={(e) => { coinBurst(e.clientX, e.clientY, 10); laugh("Gaharaha! Download? Ye scroll 1702 ka hai, PDF nahi bana. Vault aake padho!"); }}>Download</CannonButton>
            </div>
          </div>
        )}
      </ChestModal>
    </section>
  );
}
