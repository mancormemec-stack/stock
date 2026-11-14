import { Check, MapPin, Briefcase, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";
import type { Line, Stop, LineId } from "./types";
import { LINE_ICON, LINE_STYLE } from "./lines";
import { useI18n } from "@/i18n/I18nProvider";
import type { Key } from "@/i18n/dict";

type Props = { line: Line; onToggleStop: (lineId: LineId, stopId: string) => void };

export const activeStopOf = (line: Line) => line.stops.find((s) => !s.done);

function Badge({ stop }: { stop: Stop }) {
  const { t } = useI18n();
  if (!stop.verification) return null;
  return stop.verification.kind === "verified" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-ok-bg px-2 py-0.5 text-[12px] font-semibold text-ok">
      <ShieldCheck className="size-3.5 shrink-0" aria-hidden /> {t("j.verified", { date: stop.verification.date })}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-warn-bg px-2 py-0.5 text-[12px] font-semibold text-warn">
      <AlertTriangle className="size-3.5 shrink-0" aria-hidden /> {t("j.unconfirmed")}
    </span>
  );
}

export function JourneyLine({ line, onToggleStop }: Props) {
  const { t } = useI18n();
  const st = LINE_STYLE[line.id];
  const Icon = LINE_ICON[line.id];
  const active = activeStopOf(line);
  const k = (s: string) => s as Key;
  return (
    <article aria-labelledby={`line-${line.id}`} className="rounded-[20px] bg-card p-4 shadow-card">
      <header className="rise mb-3 flex items-center gap-3">
        <span aria-hidden className={`grid size-[40px] shrink-0 place-items-center rounded-[12px] ${st.tint} ${st.icon}`}><Icon className="size-5" strokeWidth={2} /></span>
        <div className="min-w-0 flex-1">
          <h3 id={`line-${line.id}`} className="font-display text-[18px] font-bold leading-tight">
            <span className="sr-only">{t(k(`line.${line.id}.label`))}: </span>{t(k(`line.${line.id}.name`))}
          </h3>
          <p className="text-[13px] font-semibold text-muted-foreground">{t(k(`line.${line.id}.office`))}</p>
        </div>
      </header>
      <ol className="relative flex flex-col gap-1">
        {line.stops.map((s, i) => {
          const isActive = active?.id === s.id;
          const last = i === line.stops.length - 1;
          return (
            <li key={s.id} id={isActive ? `active-${line.id}` : undefined} aria-current={isActive ? "step" : undefined}
              style={{ ["--i" as string]: i + 1 }} className={`rise relative flex gap-3 rounded-[14px] p-2.5 transition-colors duration-300 ${isActive ? "bg-peach" : ""}`}>
              {!last && (<>
                <span aria-hidden className="absolute start-[23px] top-[40px] -bottom-[14px] w-[2px] bg-border" />
                <span aria-hidden style={{ ["--i" as string]: i }}
                  className={`draw-down absolute start-[23px] top-[40px] -bottom-[14px] w-[2px] bg-success transition-opacity duration-300 ${s.done ? "opacity-100" : "opacity-0"}`} />
              </>)}
              <button type="button" onClick={() => onToggleStop(line.id, s.id)} aria-pressed={s.done}
                aria-label={`${t(k(`${s.id}.t`))}: ${s.done ? t("j.undo") : t("j.markDone")}`}
                className={`press tap relative z-10 grid size-[28px] shrink-0 place-items-center rounded-full transition-colors duration-300 ease-out ${
                  s.done ? "bg-success text-primary-foreground" : isActive ? "border-2 border-primary bg-card" : "border-2 border-input bg-card"}`}>
                {isActive && <span aria-hidden className="ping-ring absolute -inset-[2px] rounded-full border-2 border-primary" />}
                {s.done ? <Check key="d" className="pop size-4" strokeWidth={3} aria-hidden /> : isActive ? <span aria-hidden className="size-2.5 rounded-full bg-primary" /> : null}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-[15px] font-bold leading-snug ${s.done ? "text-muted-foreground" : "text-foreground"}`}>
                  {t(k(`${s.id}.t`))}
                  {isActive && <span className="pop ms-1.5 inline-block rounded-full bg-card px-2 py-px align-middle text-[12px] text-primary-text">{t("j.here")}</span>}
                  {s.done && <span className="sr-only"> ({t("j.done")})</span>}
                </p>
                {!s.done && (
                  <dl className="mt-1 space-y-0.5 text-[13px] leading-snug">
                    <div className="flex gap-1.5"><dt className="flex shrink-0 items-center gap-1 font-semibold text-muted-foreground"><MapPin className="size-3.5" aria-hidden />{t("j.where")}</dt><dd>{t(k(`${s.id}.w`))}</dd></div>
                    <div className="flex gap-1.5"><dt className="flex shrink-0 items-center gap-1 font-semibold text-muted-foreground"><Briefcase className="size-3.5" aria-hidden />{t("j.bring")}</dt><dd>{t(k(`${s.id}.b`))}</dd></div>
                  </dl>
                )}
                {s.verification && <div className="mt-1.5"><Badge stop={s} /></div>}
              </div>
              <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 text-decor rtl:-scale-x-100" />
            </li>
          );
        })}
      </ol>
    </article>
  );
}
