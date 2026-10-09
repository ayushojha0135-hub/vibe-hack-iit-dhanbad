import { Music, Waves } from "lucide-react";
import { useAmbience } from "@/lib/ambience";

export function AmbienceToggle({ className = "", compact = false }) {
  const [on, toggle] = useAmbience();
  return (
    <button type="button" data-testid="ambience-toggle" onClick={toggle} aria-pressed={on} aria-label={on ? "Mute sea ambience" : "Play sea ambience"}
      title={on ? "Sea shanty & waves: ON" : "Play waves & sea shanty"}
      className={`group flex items-center gap-2 rounded-full border transition-colors duration-300 ${compact ? "h-10 px-3" : "h-10 px-4"} ${on ? "bg-[#174653] border-[#4DF0D1]/60 text-[#4DF0D1]" : "bg-[#0B202C]/70 border-[#D6A64F]/40 text-[#E9D4A5] hover:text-[#F2C66D] hover:border-[#F2C66D]/60"} ${className}`}>
      {on ? <Waves size={16} /> : <Music size={16} />}
      {!compact && <span className="f-mono text-[11px] tracking-[0.18em] uppercase hidden sm:inline">{on ? "Shanty on" : "Sea music"}</span>}
      <span className="flex items-end gap-[2px] h-3.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`w-[3px] rounded-sm bg-current eq-bar ${on ? "eq-live" : ""}`} style={{ animationDelay: `${i * 0.13}s`, height: on ? undefined : "4px" }} />
        ))}
      </span>
    </button>
  );
}
