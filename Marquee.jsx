const WORDS = ["Knowledge be the greatest treasure", "Attendance be the greatest enemy", "Compile the cannons", "Debug the sails", "Seventy-five percent or the plank", "Servers powered by kraken-blood"];

const Star = () => (
  <svg width="22" height="22" viewBox="0 0 64 64" className="mx-10 shrink-0" aria-hidden>
    <path d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28Z" fill="#D6A64F" />
  </svg>
);

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div data-testid="editorial-marquee" className="relative py-8 border-y border-[#D6A64F]/25 bg-[#0B202C] overflow-hidden">
      <div className="marquee-track items-center">
        {row.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className={`f-display text-3xl sm:text-5xl font-bold whitespace-nowrap ${i % 2 ? "text-transparent [-webkit-text-stroke:1px_#D6A64F]" : "text-[#E9D4A5]"}`}>{w}</span>
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
