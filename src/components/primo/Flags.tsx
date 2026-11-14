import type { ReactNode } from "react";
/** Small round language marks. Arabic uses a neutral script mark, not a country flag. */
export function LangMark({ code }: { code: string }) {
  const clip = <clipPath id={`f-${code}`}><circle cx="12" cy="12" r="11" /></clipPath>;
  const wrap = (body: ReactNode) => (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[22px] shrink-0">
      <defs>{clip}</defs><g clipPath={`url(#f-${code})`}>{body}</g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="var(--border)" strokeWidth="1.5" />
    </svg>
  );
  switch (code) {
    case "it": return wrap(<><rect width="8" height="24" fill="var(--flag-green)" /><rect x="8" width="8" height="24" fill="var(--flag-white)" /><rect x="16" width="8" height="24" fill="var(--flag-red)" /></>);
    case "ro": return wrap(<><rect width="8" height="24" fill="var(--flag-blue)" /><rect x="8" width="8" height="24" fill="var(--flag-yellow)" /><rect x="16" width="8" height="24" fill="var(--flag-red)" /></>);
    case "uk": return wrap(<><rect width="24" height="12" fill="var(--flag-blue)" /><rect y="12" width="24" height="12" fill="var(--flag-yellow)" /></>);
    case "en": return wrap(<><rect width="24" height="24" fill="var(--flag-navy)" /><path d="M0 0 L24 24 M24 0 L0 24" stroke="var(--flag-white)" strokeWidth="4" /><path d="M0 0 L24 24 M24 0 L0 24" stroke="var(--flag-red)" strokeWidth="1.5" /><path d="M12 0 V24 M0 12 H24" stroke="var(--flag-white)" strokeWidth="6" /><path d="M12 0 V24 M0 12 H24" stroke="var(--flag-red)" strokeWidth="3.5" /></>);
    case "fil": return wrap(<><rect width="24" height="12" fill="var(--flag-blue)" /><rect y="12" width="24" height="12" fill="var(--flag-red)" /><path d="M0 0 L13 12 L0 24 Z" fill="var(--flag-white)" /><circle cx="4.5" cy="12" r="2" fill="var(--flag-yellow)" /></>);
    default: return (
      <span aria-hidden className="grid size-[22px] shrink-0 place-items-center rounded-full bg-petrol-tint text-[13px] font-bold leading-none text-petrol dark:text-secondary-foreground" lang="ar">ع</span>
    );
  }
}
