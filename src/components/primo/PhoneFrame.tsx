import { memo, type ReactNode } from "react";
import { StatusBar } from "./StatusBar";

/** >=768px: app inside a phone; <768px: full screen with safe areas. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar relative h-[100dvh] w-full overflow-hidden bg-background md:h-[844px] md:w-[390px] md:rounded-[48px] md:border-[12px] md:border-[var(--phone-bezel)] md:phone-glow md:phone-in">
      <div className="flex h-full flex-col safe-top md:pt-0">
        <StatusBar />
        <div className="relative min-h-0 flex-1">{children}</div>
        <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 hidden h-1.5 w-32 -translate-x-1/2 rounded-full bg-foreground/80 md:block" />
      </div>
    </div>
  );
}

const PATHS = [
  "M-20 160 H420 Q480 160 520 220 L700 480 Q740 540 800 540 H1220",
  "M-20 420 H260 Q320 420 360 360 L520 120 Q560 60 620 60 H1220",
  "M-20 700 H500 Q560 700 600 640 L700 480 Q740 420 800 420 H1220",
];
const COLORS = ["var(--line-a)", "var(--line-b)", "var(--line-c)"];

/** Wide screens only: faint route lines with a slow "train" dot. */
function MetroBackdropBase() {
  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 hidden h-full w-full md:block" preserveAspectRatio="none" viewBox="0 0 1200 800">
      {PATHS.map((d, i) => <path key={d} d={d} fill="none" stroke={COLORS[i]} strokeWidth="6" strokeLinecap="round" opacity=".12" />)}
      <circle r="7" className="train-dot" fill={COLORS[0]} opacity=".55" style={{ offsetPath: `path("${PATHS[0]}")` }} />
      {[[420,160],[700,480],[360,360],[620,60],[500,700],[800,420],[1000,540],[1000,60]].map(([x,y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="10" fill="var(--background)" stroke="var(--decor)" strokeWidth="3" opacity=".35" />
      ))}
    </svg>
  );
}

export const MetroBackdrop = memo(MetroBackdropBase);
