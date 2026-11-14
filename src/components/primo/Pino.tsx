import { memo } from "react";
export type PinoMood = "idle" | "wave" | "listening" | "thinking" | "speaking";
type Props = { mood: PinoMood; level?: number; className?: string; title?: string };

const L = "var(--pino-line)";
const happy = (m: PinoMood) => m === "wave" || m === "speaking";

/** Pino, the travel buddy. Separate parts animate via CSS (transform/opacity only). */
function PinoBase({ mood, level, className = "", title }: Props) {
  const open = mood === "speaking" ? (level == null ? null : 0.35 + 0.75 * Math.min(1, Math.max(0, level))) : mood === "listening" ? 0.55 : 1;
  return (
    <svg viewBox="0 0 200 230" data-mood={mood} className={`pino ${className}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g className="pino-root" strokeLinejoin="round" strokeLinecap="round">
        {/* backpack */}
        <g className="pino-pack">
          <rect x="26" y="122" width="48" height="74" rx="18" fill="var(--pino-orange)" stroke={L} strokeWidth="5" transform="rotate(-8 50 160)" />
          <rect x="32" y="150" width="30" height="22" rx="8" fill="var(--pino-orange-dark)" transform="rotate(-8 50 160)" />
        </g>
        {/* body */}
        <g className="pino-body">
          <path d="M62 128 Q56 176 64 214 L136 214 Q144 176 138 128 Q100 112 62 128 Z" fill="var(--pino-skin)" stroke={L} strokeWidth="5" />
          <path d="M70 130 Q66 170 70 200" fill="none" stroke="var(--pino-orange)" strokeWidth="8" />
          <path d="M96 196 V214 M104 196 V214" stroke={L} strokeWidth="4" />
          <g className="pino-flag">
            <rect x="106" y="146" width="7" height="12" fill="var(--flag-green)" />
            <rect x="113" y="146" width="7" height="12" fill="var(--flag-white)" />
            <rect x="120" y="146" width="7" height="12" fill="var(--flag-red)" />
            <rect x="106" y="146" width="21" height="12" rx="1.5" fill="none" stroke={L} strokeWidth="1.5" />
          </g>
          {/* left arm */}
          <ellipse cx="60" cy="172" rx="12" ry="24" fill="var(--pino-skin)" stroke={L} strokeWidth="5" transform="rotate(12 60 172)" />
        </g>
        {/* right arm */}
        <g className="pino-arm-r">
          <path d="M134 140 Q154 120 156 96" fill="none" stroke={L} strokeWidth="27" />
          <path d="M134 140 Q154 120 156 96" fill="none" stroke="var(--pino-skin)" strokeWidth="17" />
          <circle cx="157" cy="90" r="13" fill="var(--pino-skin)" stroke={L} strokeWidth="5" />
        </g>
        {/* head */}
        <g className="pino-head">
          <circle cx="100" cy="74" r="46" fill="var(--pino-skin)" stroke={L} strokeWidth="5" />
          <g className="pino-cap">
            <path d="M56 66 Q56 18 102 18 Q146 20 148 62 Q100 48 56 66 Z" fill="var(--pino-orange)" stroke={L} strokeWidth="5" />
            <path d="M126 54 Q162 42 182 58 Q158 68 132 64 Z" fill="var(--pino-orange-dark)" stroke={L} strokeWidth="5" />
            <circle cx="102" cy="20" r="4" fill="var(--pino-orange-dark)" />
          </g>
          <g className="pino-brows" fill="none" stroke={L} strokeWidth="3">
            <path d="M78 66 Q84 62 90 65" /><path d="M110 65 Q116 62 122 66" />
          </g>
          <g className="pino-eyes">
            {happy(mood) ? (
              <g fill="none" stroke={L} strokeWidth="4.5"><path d="M78 82 Q84 74 90 82" /><path d="M110 82 Q116 74 122 82" /></g>
            ) : (
              <g fill={L}>
                <ellipse cx="84" cy="80" rx="5" ry={mood === "listening" ? 7.5 : 6.5} />
                <ellipse cx="116" cy="80" rx="5" ry={mood === "listening" ? 7.5 : 6.5} />
                <circle cx="86" cy="77" r="1.6" fill="var(--pino-skin)" /><circle cx="118" cy="77" r="1.6" fill="var(--pino-skin)" />
              </g>
            )}
            {!happy(mood) && <g fill="var(--pino-skin)">
              <rect className="pino-lid" x="77" y="72" width="14" height="16" />
              <rect className="pino-lid" x="109" y="72" width="14" height="16" />
            </g>}
          </g>
          <g className="pino-mouth" style={{ transform: mood === "thinking" || open == null ? undefined : `scaleY(${open})` }}>
            <path d="M88 94 Q100 96 112 94 Q110 110 100 110 Q90 110 88 94 Z" fill={L} />
            <ellipse cx="100" cy="105" rx="6" ry="3.5" fill="var(--pino-orange)" />
          </g>
        </g>
        <g className="pino-sparks" stroke="var(--pino-orange)" strokeWidth="5">
          <line x1="164" y1="30" x2="170" y2="16" /><line x1="174" y1="40" x2="188" y2="30" /><line x1="178" y1="54" x2="194" y2="52" />
        </g>
        <g className="pino-dots" fill="var(--pino-line)">
          <circle cx="160" cy="22" r="4.5" /><circle cx="174" cy="16" r="4.5" /><circle cx="188" cy="10" r="4.5" />
        </g>
      </g>
    </svg>
  );
}

export const Pino = memo(PinoBase);
