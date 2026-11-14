import type { SVGProps } from "react";
export function FootprintsLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden {...props}>
      <circle cx="24" cy="24" r="23" fill="var(--line-a)" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="var(--background)" strokeWidth="2" opacity=".35" />
      <g fill="var(--primary-foreground)">
        <ellipse cx="18" cy="27" rx="4" ry="6.5" transform="rotate(-12 18 27)" />
        <circle cx="16.2" cy="18.2" r="1.6" /><circle cx="19.6" cy="17.8" r="1.4" />
        <ellipse cx="30" cy="22" rx="4" ry="6.5" transform="rotate(12 30 22)" />
        <circle cx="28.6" cy="13.3" r="1.6" /><circle cx="32" cy="13.9" r="1.4" />
      </g>
    </svg>
  );
}
