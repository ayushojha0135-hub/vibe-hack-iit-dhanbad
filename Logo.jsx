export const LogoMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
    <circle cx="32" cy="32" r="29" fill="#071923" stroke="#D6A64F" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="21" fill="none" stroke="#D6A64F" strokeWidth="1" strokeDasharray="2 3" />
    <path d="M32 6 L36 28 L58 32 L36 36 L32 58 L28 36 L6 32 L28 28Z" fill="#F2C66D" />
    <path d="M32 14 L34.5 29.5 L32 32 L29.5 29.5Z" fill="#B91C1C" />
    <circle cx="32" cy="32" r="4" fill="#071923" stroke="#F2C66D" strokeWidth="1.5" />
  </svg>
);

export const Logo = ({ compact = false }) => (
  <span className="flex items-center gap-3">
    <LogoMark size={compact ? 34 : 40} />
    <span className="leading-none">
      <span className="f-display font-black tracking-[0.2em] text-[#F2C66D] text-lg block">PITR</span>
      {!compact && <span className="f-mono text-[10px] tracking-[0.2em] text-[#E9D4A5]/80 uppercase hidden sm:block mt-1">Pirate Inst. of Tech &amp; Research</span>}
    </span>
  </span>
);
