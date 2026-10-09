import { motion } from "framer-motion";

export const ParrotSvg = ({ mood = "idle", talking = false, size = 84 }) => {
  const open = mood === "laugh" || talking;
  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} className={mood === "laugh" ? "parrot-laugh" : ""} style={{ transform: "scaleX(-1)", overflow: "visible" }}>
      <defs>
        <radialGradient id="pbody" cx="40%" cy="35%"><stop offset="0" stopColor="#3CCB9F" /><stop offset="1" stopColor="#0F5A4A" /></radialGradient>
        <radialGradient id="peye"><stop offset="0" stopColor="#FFF4C2" /><stop offset=".45" stopColor="#F2C66D" /><stop offset="1" stopColor="#D6A64F" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="14" y="99" width="70" height="6" rx="3" fill="#5A3B1C" />
      <path d="M46 82 L36 108 L48 97 L54 110 L60 96 L62 82Z" fill="#B91C1C" />
      <path d="M50 84 L46 104 L54 96Z" fill="#F2C66D" />
      <ellipse cx="52" cy="68" rx="22" ry="27" fill="url(#pbody)" />
      <path d="M43 60 Q52 94 63 60Z" fill="#174653" stroke="#D6A64F" strokeWidth="1.2" />
      <path d="M47 66 H52 V74 H57 M50 80 H55" stroke="#4DF0D1" strokeWidth="1" fill="none" opacity=".8" />
      <g className="parrot-wing">
        <path d="M34 56 Q18 74 32 94 Q44 82 47 60Z" fill="#0B4A3C" stroke="#D6A64F" strokeWidth=".8" />
        <path d="M30 70 Q36 78 34 88 M36 64 Q42 72 40 82" stroke="#3CCB9F" strokeWidth="1" fill="none" />
      </g>
      <path d="M44 94 v6 M58 94 v6" stroke="#8a8a8a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="56" cy="36" r="18" fill="url(#pbody)" />
      <path d="M33 27 Q56 2 79 27 Q56 19 33 27Z" fill="#0A0A0A" stroke="#D6A64F" strokeWidth="1.2" />
      <circle cx="56" cy="17" r="3" fill="#E9D4A5" />
      <path d="M53.5 21 L58.5 21" stroke="#E9D4A5" strokeWidth="1" />
      <line x1="70" y1="15" x2="77" y2="4" stroke="#D6A64F" strokeWidth="1.5" />
      <circle cx="77" cy="4" r="2.6" fill="#4DF0D1" className="blink" />
      <circle cx="62" cy="36" r="10" fill="url(#peye)" className="eye-glow" />
      <circle cx="62" cy="36" r="6.5" fill="#1b2a30" stroke="#D6A64F" strokeWidth="1.6" />
      <circle cx="62" cy="36" r="2.8" fill="#FFF4C2" />
      <circle cx="47" cy="34" r="3.4" fill="#fff" />
      <circle cx="47.6" cy="34.2" r="1.8" fill="#000" />
      <path d="M65 40 Q83 40 79 55 Q74 47 63 46Z" fill="#F2C66D" stroke="#8a5a1a" strokeWidth=".8" />
      <motion.path d="M63 46 Q72 48 75 53 Q68 56 62 50Z" fill="#D6A64F" stroke="#8a5a1a" strokeWidth=".6"
        style={{ transformOrigin: "63px 46px", transformBox: "view-box" }}
        animate={{ rotate: open ? [0, 22, 0] : 0 }} transition={{ repeat: open ? Infinity : 0, duration: 0.24 }} />
    </svg>
  );
};
