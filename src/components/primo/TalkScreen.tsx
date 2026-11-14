import { useState } from "react";
import { Keyboard, Mic, Square, Volume2, VolumeX, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatItem, MicState } from "./types";
import { Pino, type PinoMood } from "./Pino";
import { RomeScene } from "./RomeScene";
import { useI18n } from "@/i18n/I18nProvider";

export type AskStage = "name" | "eu" | "done";
type Props = {
  greeting: string; micState: MicState; items: ChatItem[]; inSession: boolean; audioOn: boolean; askStage: AskStage;
  onStartVoice: () => void; onStartText: () => void; onEnd: () => void; onOpenConversation: () => void;
  onToggleAudio: () => void; onOpenMenu: () => void; onOpenSettings: () => void;
  onAnswerName: (name: string) => void; onAnswerEu: (v: boolean | null) => void;
  canSimplify: boolean; onSimplify: () => void;
};

const MOOD: Record<MicState, PinoMood> = { idle: "idle", listening: "listening", thinking: "thinking", speaking: "speaking" };
const BARS = [.35, .55, .8, .6, 1, .7, .9, .5, .75, .45, .3];

const pill = "press min-h-[44px] rounded-full border border-border bg-card px-4 text-[15px] font-bold text-foreground shadow-card";

export function TalkScreen(p: Props) {
  const { t } = useI18n();
  const { micState, askStage } = p;
  const active = micState === "listening" || micState === "speaking";
  const [name, setName] = useState("");
  const lastAssistant = [...p.items].reverse().find((m) => m.kind === "assistant");
  const said = lastAssistant && lastAssistant.kind === "assistant" ? (lastAssistant.textKey ? t(lastAssistant.textKey) : lastAssistant.text) : "";
  const bubble = askStage === "name" ? t("onb.t2") : askStage === "eu" ? t("onb.t3")
    : !p.inSession && micState === "idle" ? `${p.greeting} ${t("pino.ready")}` : micState === "listening" ? t("mic.listening") : said;

  return (
    <div className="relative flex h-full flex-col">
      <header className="relative flex h-[52px] shrink-0 items-center justify-center px-3">
        <h1 className="font-display text-[20px] font-bold text-petrol dark:text-foreground">Primo Passo</h1>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center px-4">
        <button type="button" onClick={p.onOpenConversation} aria-label={t("conv.open")} disabled={askStage !== "done"}
          className="rise press relative mt-2 w-full rounded-[22px] bg-card px-4 py-3 text-center shadow-card">
          <span key={bubble} aria-live="polite" className="fade-in block line-clamp-4 text-[16px] font-semibold leading-snug">{bubble}</span>
          {askStage === "name" && <span className="mt-1 block text-[12px] text-muted-foreground">{t("onb.nameNote")}</span>}
          <span aria-hidden className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-card" />
        </button>

        {askStage === "done" && p.canSimplify && (
          <Button variant="outline" onClick={p.onSimplify} disabled={micState === "listening" || micState === "thinking"}
            className="press mt-3 min-h-[44px] shrink-0 rounded-full border-border bg-card px-4 text-[15px] font-bold text-foreground shadow-card">
            <MessageCircleQuestion aria-hidden />{t("conv.simplify")}
          </Button>
        )}

        {askStage === "name" && (
          <form className="rise mt-4 flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); p.onAnswerName(name.trim()); }}>
            <label htmlFor="pino-name" className="sr-only">{t("onb.nameLabel")}</label>
            <input id="pino-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name.placeholder")} autoComplete="given-name"
              className="h-[44px] min-w-0 flex-1 rounded-full border border-border bg-card px-4 text-[15px] shadow-card placeholder:text-muted-foreground" />
            <button type="submit" className="press min-h-[44px] rounded-full bg-petrol px-4 text-[15px] font-bold text-petrol-foreground">{t("name.ok")}</button>
            <button type="button" onClick={() => p.onAnswerName("")} className={pill}>{t("onb.skip")}</button>
          </form>
        )}
        {askStage === "eu" && (
          <div role="group" aria-label={t("onb.t3")} className="rise mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => p.onAnswerEu(true)} className={pill}>{t("onb.yes")}</button>
            <button type="button" onClick={() => p.onAnswerEu(false)} className={pill}>{t("onb.no")}</button>
            <button type="button" onClick={() => p.onAnswerEu(null)} className={pill}>{t("onb.noSay")}</button>
          </div>
        )}

        <div className="relative -mx-4 mt-3 flex min-h-0 w-[calc(100%+2rem)] flex-1 items-center justify-center">
          <RomeScene className="absolute inset-x-0 bottom-0 h-[220px] w-full opacity-80" />
          <span aria-hidden className="absolute bottom-[10px] size-[250px] rounded-full bg-peach opacity-50" />
          <Pino mood={MOOD[micState]} className="relative h-[260px] max-h-full w-auto" />
        </div>
        <div aria-hidden className={`flex h-[36px] items-center gap-[5px] ${active ? "wave-group" : ""}`}>
          {BARS.map((b, i) => (
            <span key={i} className="w-[5px] rounded-full bg-primary"
              style={{ height: 36, transform: `scaleY(${active ? b : 0.15})`, opacity: active ? 1 : 0.4 }} />
          ))}
        </div>
        <p role="status" className="sr-only">{t(`mic.${micState}`)}</p>
      </div>

      <div className="relative shrink-0 px-4 pb-1 pt-1">
        <div className="glass flex h-[68px] items-center justify-between rounded-full px-3 shadow-card">
          <button type="button" onClick={p.onStartText} aria-label={t("write")} className="press tap grid size-[52px] place-items-center rounded-full bg-surface-2 text-foreground">
            <Keyboard className="size-[22px]" aria-hidden />
          </button>
          <span className="relative grid place-items-center">
            {active && <span aria-hidden className="ping-ring absolute size-[72px] rounded-full bg-primary/30" />}
            <button type="button" onClick={micState === "idle" ? p.onStartVoice : p.onEnd} aria-pressed={micState !== "idle"}
              aria-label={micState === "idle" ? t("mic.startAria") : t("end")}
              className={`press relative -mt-6 grid size-[76px] place-items-center rounded-full text-primary-foreground shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] ring-4 ring-background ${micState === "thinking" ? "bg-petrol" : "bg-primary"}`}>
              <span key={micState} className="pop">{micState === "idle" ? <Mic className="size-8" aria-hidden /> : <Square className="size-6 fill-current" aria-hidden />}</span>
            </button>
          </span>
          <button type="button" onClick={p.onToggleAudio} aria-pressed={p.audioOn} aria-label={p.audioOn ? t("audio.off") : t("audio.on")}
            className="press tap grid size-[52px] place-items-center rounded-full bg-surface-2 text-foreground">
            {p.audioOn ? <Volume2 className="size-[22px] rtl:-scale-x-100" aria-hidden /> : <VolumeX className="size-[22px] rtl:-scale-x-100" aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
