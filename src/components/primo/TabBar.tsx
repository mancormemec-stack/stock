import { House, Route, UserRound, Square, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Key } from "@/i18n/dict";

export type TabId = "parla" | "percorso" | "foglio" | "io";
/** Screen order (for slide direction). "foglio" is reached from Percorso, not from the bar. */
export const SCREEN_ORDER: TabId[] = ["parla", "percorso", "foglio", "io"];
export const TABS: { id: TabId; Icon: LucideIcon; label: Key }[] = [
  { id: "parla", Icon: House, label: "tab.home" }, { id: "percorso", Icon: Route, label: "tab.percorso" }, { id: "io", Icon: UserRound, label: "tab.profilo" },
];

type Props = { active: TabId; inSession: boolean; onChange: (t: TabId) => void; onEnd: () => void };

export function TabBar({ active, inSession, onChange, onEnd }: Props) {
  const { t, dir } = useI18n();
  const shown = active === "foglio" ? "percorso" : active;
  const idx = TABS.findIndex((x) => x.id === shown);
  if (inSession) {
    return (
      <div className="safe-bottom flex h-[72px] shrink-0 items-center justify-center px-4 md:pb-5">
        <button type="button" onClick={onEnd} className="pop press flex h-[48px] items-center gap-2 rounded-full bg-destructive px-8 text-[16px] font-bold text-destructive-foreground shadow-card">
          <Square className="size-4 fill-current" aria-hidden /> {t("end")}
        </button>
      </div>
    );
  }
  const move = (d: number) => {
    const next = TABS[(idx + d + TABS.length) % TABS.length]!;
    onChange(next.id);
    requestAnimationFrame(() => document.getElementById(`tab-${next.id}`)?.focus());
  };
  return (
    <nav aria-label={t("nav.sections")} className="safe-bottom shrink-0 px-4 pt-1 md:pb-5">
      <div role="tablist" aria-label={t("nav.sections")} className="glass relative grid h-[60px] grid-cols-3 rounded-full p-1.5 shadow-card"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(dir === "rtl" ? -1 : 1);
          if (e.key === "ArrowLeft") move(dir === "rtl" ? 1 : -1);
        }}>
        <span aria-hidden className="pointer-events-none absolute inset-y-1.5 start-1.5 w-[calc((100%-12px)/3)] rounded-full bg-peach transition-transform duration-300 [transition-timing-function:var(--spring)]"
          style={{ transform: `translateX(calc(${idx * 100}% * var(--dirx)))` }} />
        {TABS.map(({ id, Icon, label }) => {
          const sel = id === shown;
          return (
            <button key={id} id={`tab-${id}`} type="button" role="tab" aria-selected={sel} aria-controls={`panel-${id}`}
              tabIndex={sel ? 0 : -1} onClick={() => onChange(id)}
              className={`press relative flex items-center justify-center gap-1.5 rounded-full px-1 text-[13px] font-bold leading-tight transition-colors duration-200 ${sel ? "text-primary-text" : "text-muted-foreground"}`}>
              <Icon key={sel ? `${id}-on` : id} className={`size-[20px] shrink-0 ${sel ? "icon-bounce" : ""}`} aria-hidden strokeWidth={2} />
              <span className="min-w-0 text-center">{t(label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
