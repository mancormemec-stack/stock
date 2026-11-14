import { ArrowLeft } from "lucide-react";
/** Large title that collapses when the screen content scrolls (transform only). */
export function ScreenHeader({ title, compact, onBack, backLabel }: { title: string; compact: boolean; onBack?: () => void; backLabel?: string }) {
  return (
    <header className={`glass sticky top-0 z-10 flex h-[56px] items-center gap-2 px-4 ${compact ? "border-b border-border" : ""}`}>
      {onBack && (
        <button type="button" onClick={onBack} aria-label={backLabel} className="press tap grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-card text-foreground shadow-card">
          <ArrowLeft className="size-5 rtl:-scale-x-100" aria-hidden />
        </button>
      )}
      <h1 className={`origin-left font-display text-[24px] font-bold leading-tight text-petrol transition-transform duration-200 ease-out rtl:origin-right dark:text-foreground ${compact ? "scale-[0.78]" : ""}`}>{title}</h1>
    </header>
  );
}
