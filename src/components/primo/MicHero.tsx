import { Mic, Keyboard, Volume2, Languages } from "lucide-react";
import type { MicState } from "./types";
import { useI18n } from "@/i18n/I18nProvider";

type Props = {
  micState: MicState; onStartVoice: () => void; onStartText: () => void;
  onLanguage?: () => void; caption?: string; large?: boolean;
};

const CORE: Record<MicState, string> = {
  idle: "bg-primary breathe", listening: "bg-primary", thinking: "bg-petrol", speaking: "bg-primary",
};

const side = "press tap grid size-[48px] shrink-0 place-items-center rounded-[14px] border border-border bg-card text-petrol shadow-card dark:text-foreground";

export function MicHero({ micState, onStartVoice, onStartText, onLanguage, caption, large }: Props) {
  const { t } = useI18n();
  const label = t(`mic.${micState}`);
  const Icon = micState === "speaking" ? Volume2 : Mic;
  const box = large ? "size-[200px]" : "size-[150px]";
  const core = large ? "size-[120px]" : "size-[92px]";
  return (
    <section aria-label={t("home.talk")} className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-4">
        <button type="button" onClick={onStartText} aria-label={t("write")} className={side}><Keyboard className="size-[22px]" aria-hidden strokeWidth={2} /></button>
        <div className={`relative grid ${box} place-items-center`}>
          {micState === "idle" && (<>
            <span aria-hidden className="ring-slow absolute inset-0 rounded-full bg-peach opacity-60" />
            <span aria-hidden style={{ animationDelay: "1.2s" }} className="ring-slow absolute inset-[14%] rounded-full bg-peach" />
          </>)}
          {micState === "listening" && [0, 0.6, 1.2].map((d) => (
            <span key={d} aria-hidden style={{ animationDelay: `${d}s` }} className="ring-listen absolute inset-[22%] rounded-full bg-primary/25" />
          ))}
          {micState === "thinking" && (<>
            <span aria-hidden className="absolute inset-[8%] rounded-full bg-petrol-tint" />
            <span aria-hidden className="ring-think absolute inset-[8%] rounded-full border-2 border-dashed border-petrol/50 dark:border-line-b">
              <span className="absolute -top-[5px] left-1/2 size-[10px] -translate-x-1/2 rounded-full bg-petrol dark:bg-line-b" />
            </span>
          </>)}
          {micState === "speaking" && [0, 0.3].map((d) => (
            <span key={d} aria-hidden style={{ animationDelay: `${d}s` }} className={`ring-speak absolute rounded-full bg-primary/20 ${d ? "inset-[4%]" : "inset-[14%]"}`} />
          ))}
          <button type="button" onClick={onStartVoice} aria-pressed={micState !== "idle"}
            aria-label={micState === "idle" ? t("mic.startAria") : t("mic.aria", { state: label })}
            className={`press relative grid ${core} place-items-center rounded-full text-primary-foreground shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-colors duration-300 ease-out ${CORE[micState]}`}>
            <span key={micState} className="pop grid place-items-center">
              <Icon className={large ? "size-12" : "size-10"} aria-hidden strokeWidth={2} />
            </span>
          </button>
        </div>
        {onLanguage
          ? <button type="button" onClick={onLanguage} aria-label={t("io.chooseLang")} className={side}><Languages className="size-[22px]" aria-hidden strokeWidth={2} /></button>
          : <span aria-hidden className="size-[48px] shrink-0" />}
      </div>
      <div className="flex h-[18px] items-end gap-[3px]" aria-hidden>
        {micState === "speaking" && [0, .15, .3, .45, .6, .45, .3].map((d, i) => (
          <span key={i} style={{ animationDelay: `${d}s` }} className="wave-bar h-full w-[4px] rounded-full bg-primary" />
        ))}
      </div>
      <p key={micState} role="status" aria-live="polite" className={`rise -mt-2 text-center font-display font-bold ${large ? "text-[20px]" : "text-[17px]"} ${micState === "idle" ? "text-foreground" : micState === "thinking" ? "text-petrol dark:text-line-b-text" : "text-primary-text"}`}>
        {micState === "idle" && caption ? caption : label}
      </p>
    </section>
  );
}
