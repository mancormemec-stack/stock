import { memo } from "react";
/** Soft background: Colosseum, cypresses and hills in peach and green. Decorative only. */
function RomeSceneBase({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 390 260" preserveAspectRatio="xMidYMax slice" className={`pointer-events-none ${className}`}>
      <circle cx="300" cy="60" r="30" fill="var(--scene-sky)" />
      <g fill="var(--scene-peach)">
        <path d="M222 190 V118 Q290 100 360 118 V190 Z" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={`a${i}`} x={232 + i * 25} y="128" width="13" height="18" rx="6.5" fill="var(--scene-arch)" />)}
        {[0, 1, 2, 3, 4].map((i) => <rect key={`b${i}`} x={232 + i * 25} y="156" width="13" height="20" rx="6.5" fill="var(--scene-arch)" />)}
      </g>
      <g fill="var(--scene-tree)">
        <ellipse cx="40" cy="150" rx="11" ry="46" /><ellipse cx="62" cy="166" rx="8" ry="32" /><ellipse cx="372" cy="160" rx="9" ry="36" />
      </g>
      <path d="M-10 200 Q100 160 210 190 T400 182 V260 H-10 Z" fill="var(--scene-hill-2)" />
      <path d="M-10 222 Q120 196 250 214 T400 208 V260 H-10 Z" fill="var(--scene-hill)" />
    </svg>
  );
}

export const RomeScene = memo(RomeSceneBase);
