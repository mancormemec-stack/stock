import { useState } from "react";
import { Check, Info, Ticket, UserRound } from "lucide-react";
import type { Line, LineId } from "./types";
import { LINE_ICON, LINE_STYLE } from "./lines";
import { JourneyLine } from "./JourneyLine";
import { useI18n } from "@/i18n/I18nProvider";
import type { Key } from "@/i18n/dict";

type Props = {
  lines: Line[]; onToggleStop: (lineId: LineId, stopId: string) => void;
  initialLine?: LineId; onOpenSheet: () => void; onOpenProfile: () => void;
};

export function JourneyScreen({ lines, onToggleStop, initialLine = "A", onOpenSheet, onOpenProfile }: Props) {
  const { t } = useI18n();
  const [sel, setSel] = useState<LineId>(initialLine);
  const line = lines.find((l) => l.id === sel) ?? lines[0]!;
  const steps: Key[] = ["j.stepLang", "j.stepProc", "j.stepDone"];
  return (
    <div className="flex flex-col gap-4 pb-4">
      <header className="rise rounded-b-[24px] bg-petrol px-4 pb-5 pt-3 text-petrol-foreground">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-display text-[24px] font-bold leading-tight">{t("title.percorso")}</h1>
          <button type="button" onClick={onOpenProfile} aria-label={t("io.openProfile")} className="press tap grid size-[40px] place-items-center rounded-full bg-petrol-foreground/15">
            <UserRound className="size-5" aria-hidden />
          </button>
        </div>
        <ol className="mt-4 flex items-start">
          {steps.map((k, i) => (
            <li key={k} aria-current={i === 1 ? "step" : undefined} className="relative flex flex-1 flex-col items-center gap-1 text-center">
              {i > 0 && <span aria-hidden className={`absolute end-1/2 top-[13px] h-[2px] w-[calc(100%-28px)] -translate-x-[14px] rtl:translate-x-[14px] ${i <= 1 ? "bg-primary" : "bg-petrol-foreground/30"}`} />}
              <span aria-hidden className={`relative grid size-[28px] place-items-center rounded-full text-[13px] font-bold ${i === 0 ? "bg-primary text-primary-foreground" : i === 1 ? "border-2 border-primary bg-petrol" : "border-2 border-petrol-foreground/40"}`}>
                {i === 0 ? <Check className="size-4" strokeWidth={3} /> : i === 1 ? <span className="size-2.5 rounded-full bg-primary" /> : null}
              </span>
              <span className="text-[12px] font-semibold leading-tight">{t(k)}</span>
            </li>
          ))}
        </ol>
      </header>

      <div role="radiogroup" aria-label={t("j.chooseLine")} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 py-1">
        {lines.map((l, i) => {
          const st = LINE_STYLE[l.id]; const Icon = LINE_ICON[l.id];
          const done = l.stops.filter((s) => s.done).length;
          const on = l.id === sel;
          return (
            <button key={l.id} type="button" role="radio" aria-checked={on} onClick={() => setSel(l.id)} style={{ ["--i" as string]: i }}
              className={`rise press spring-x flex w-[160px] shrink-0 snap-start flex-col gap-2 rounded-[18px] border-2 bg-card p-3 text-start shadow-card ${on ? "border-primary" : "border-transparent"}`}>
              <span aria-hidden className={`grid size-[36px] place-items-center rounded-[10px] ${st.tint} ${st.icon}`}><Icon className="size-[18px]" strokeWidth={2} /></span>
              <span className="text-[15px] font-bold leading-tight">{t(`line.${l.id}.name` as Key)}</span>
              <span className="text-[12px] font-semibold text-muted-foreground">{t("home.count", { n: done, total: l.stops.length })}</span>
              <span aria-hidden className="h-[4px] w-full overflow-hidden rounded-full bg-surface-2">
                <span className={`block h-full origin-left rounded-full transition-transform duration-300 ease-out rtl:origin-right ${st.bg}`} style={{ transform: `scaleX(${done / l.stops.length})` }} />
              </span>
            </button>
          );
        })}
      </div>

      <div key={sel} className="slide-next px-4"><JourneyLine line={line} onToggleStop={onToggleStop} /></div>

      <p className="rise mx-4 flex gap-2.5 rounded-[16px] bg-petrol-tint p-3 text-[13px] leading-snug text-petrol dark:text-secondary-foreground" style={{ ["--i" as string]: 3 }}>
        <Info className="mt-px size-[18px] shrink-0" aria-hidden /> {t("j.tip")}
      </p>
      <div className="rise flex flex-col gap-2 px-4" style={{ ["--i" as string]: 4 }}>
        <button type="button" onClick={onOpenSheet} className="press flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-primary px-5 text-[17px] font-bold text-primary-foreground shadow-card">
          <Ticket className="size-5" aria-hidden /> {t("title.foglio")}
        </button>
        <p className="self-center text-[12px] text-muted-foreground">{t("sample")}</p>
      </div>
    </div>
  );
}
