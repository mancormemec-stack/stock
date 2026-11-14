import { useI18n } from "@/i18n/I18nProvider";
import type { Key } from "@/i18n/dict";

export type DemoAction = "welcome" | "language" | "intro" | "idle" | "listening" | "thinking" | "speaking" | "percorso" | "foglio" | "documenti" | "io";
const OPTS: [DemoAction, Key][] = [
  ["welcome", "demo.welcome"], ["language", "demo.lang"], ["intro", "demo.intro"], ["idle", "demo.conv"],
  ["listening", "mic.listening"], ["thinking", "mic.thinking"], ["speaking", "mic.speaking"],
  ["percorso", "tab.percorso"], ["foglio", "tab.foglio"], ["documenti", "tab.docs"], ["io", "menu.settings"],
];

type Props = { current: DemoAction; onAction: (a: DemoAction) => void };

/** Presenter-only controls, shown outside the phone on wide screens. */
export function DemoPanel({ current, onAction }: Props) {
  const { t } = useI18n();
  return (
    <aside aria-label={t("demo.aria")} className="rise hidden w-48 flex-col gap-1.5 rounded-[20px] bg-card p-3 text-[13px] shadow-card md:flex" style={{ ["--i" as string]: 4 }}>
      <p className="px-1 font-bold uppercase tracking-wider text-muted-foreground">{t("demo.title")}</p>
      {OPTS.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={current === v} onClick={() => onAction(v)}
          className="press min-h-[36px] rounded-full border border-border px-3 py-1 text-start font-semibold text-foreground transition-colors aria-pressed:border-primary aria-pressed:bg-peach aria-pressed:text-primary-text">{t(l)}</button>
      ))}
    </aside>
  );
}
