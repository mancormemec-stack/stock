import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { LANGUAGES } from "./types";
import { AUTO_LANGS } from "@/i18n/auto-langs";
import { AutoNote } from "./AutoNote";
import { Pino } from "./Pino";
import { RomeScene } from "./RomeScene";
import { LangMark } from "./Flags";
import { useI18n } from "@/i18n/I18nProvider";

export type OnboardingResult = { language: string; firstName: string; isEuCitizen: boolean | null };
type Props = {
  language: string; onLanguageChange: (code: string) => void; onComplete: (r: OnboardingResult) => void;
  initialStep?: number; onStepChange?: (step: number) => void;
};

const HELLOS = ["Ciao!", "Hello!", "Bună!", "مرحبا!", "Привіт!", "Kumusta!"];
const ONB_LANGS = LANGUAGES.filter((l) => l.code !== "bn");
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Title() {
  return (
    <p className="relative mx-auto inline-block font-display text-[30px] font-bold leading-tight text-petrol dark:text-foreground">
      Primo Passo
      <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-2 start-[12%] h-[10px] w-[76%]">
        <path d="M3 8 C 50 2, 120 2, 197 6" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </p>
  );
}

function Bubble({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[20px] bg-card px-4 py-3 text-center text-[16px] font-semibold leading-snug shadow-card">
      {children}
      <span aria-hidden className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-card" />
    </div>
  );
}

export function Onboarding({ language, onLanguageChange, onComplete, initialStep = 0, onStepChange }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState(initialStep);
  const [dirAnim, setDirAnim] = useState<"next" | "prev">("next");
  const [picked, setPicked] = useState(initialStep > 1);
  const [hop, setHop] = useState(0);
  const [hello, setHello] = useState(0);
  const [typed, setTyped] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const intro = t("pino.intro");

  useEffect(() => { titleRef.current?.focus(); onStepChange?.(step); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step !== 0) return;
    const id = setInterval(() => { if (!document.hidden) setHello((h) => (h + 1) % HELLOS.length); }, 2000);
    return () => clearInterval(id);
  }, [step]);
  useEffect(() => {
    if (step !== 2) return;
    if (reduced()) { setTyped(intro.length); return; }
    setTyped(0);
    const id = setInterval(() => setTyped((n) => { if (n >= intro.length) { clearInterval(id); return n; } return n + 1; }), 40);
    return () => clearInterval(id);
  }, [step, intro]);

  const go = (n: number) => { setDirAnim(n > step ? "next" : "prev"); setStep(n); };
  const finish = () => onComplete({ language, firstName: "", isEuCitizen: null });
  const talking = step === 2 && typed < intro.length;
  const disabled = step === 1 && !picked;
  const cta = step === 0 ? t("onb.begin") : step === 1 ? t("onb.next") : t("onb.continue");

  return (
    <div className="no-scrollbar relative flex h-full flex-col overflow-y-auto bg-background">
      <div className="relative flex flex-1 flex-col gap-3 px-5 pb-4 pt-4 md:pb-8">
        <div key={step} className={`${dirAnim === "next" ? "slide-next" : "slide-prev"} flex flex-1 flex-col gap-3`}>
          {step === 0 && (<>
            <div className="rise text-center"><Title /></div>
            <div className="relative -mx-5 flex flex-1 items-end justify-center"><RomeScene className="absolute inset-x-0 bottom-0 h-[240px] w-full" /><Pino mood="wave" className="rise relative h-[290px] w-auto" /></div>
            <h1 ref={titleRef} tabIndex={-1} className="outline-none text-center font-display text-[30px] font-bold text-petrol dark:text-foreground">
              <span className="sr-only">Ciao!</span>
              <span key={hello} aria-hidden className="rise inline-block" dir="auto">{HELLOS[hello]}</span>
            </h1>
            <p className="rise text-center text-[15px] leading-snug text-muted-foreground" style={{ ["--i" as string]: 2 }}>{t("welcome.sub")}</p>
          </>)}
          {step === 1 && (<>
            <div className="flex items-center gap-3">
              <span key={hop} className={hop ? "pino-hop" : ""}><Pino mood={picked ? "wave" : "idle"} className="h-[96px] w-auto shrink-0" /></span>
              <div className="relative flex-1 rounded-[18px] bg-card px-3 py-2.5 shadow-card">
                <span aria-hidden className="absolute start-[-6px] top-1/2 size-3 -translate-y-1/2 rotate-45 bg-card" />
                <h1 ref={titleRef} tabIndex={-1} className="outline-none relative font-display text-[18px] font-bold leading-snug">{t("onb.t1")}</h1>
              </div>
            </div>
            <div role="radiogroup" aria-label={t("onb.t1")} className="grid grid-cols-2 gap-2.5">
              {ONB_LANGS.map((l, i) => {
                const sel = picked && l.code === language;
                return (
                  <button key={l.code} type="button" role="radio" aria-checked={sel} lang={l.code} dir={l.dir}
                    onClick={() => { onLanguageChange(l.code); setPicked(true); setHop((h) => h + 1); }} style={{ ["--i" as string]: i }}
                    className={`rise press relative flex min-h-[60px] items-center gap-2 rounded-[16px] border-2 px-3 py-2 text-start text-[16px] font-bold shadow-card transition-colors duration-200 ${sel ? "tile-pop border-primary bg-peach" : "border-transparent bg-card"}`}>
                    <LangMark code={l.code} />
                    <span className="min-w-0 flex-1">{l.label}</span>
                    {sel && <span aria-hidden className="pop grid size-[22px] shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3.5" strokeWidth={3} /></span>}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="altre-lingue" className="sr-only">{t("io.chooseLang")}</label>
              <select id="altre-lingue" value={AUTO_LANGS.some((l) => l.code === language) ? language : ""}
                onChange={(e) => { if (!e.target.value) return; onLanguageChange(e.target.value); setPicked(true); setHop((h) => h + 1); }}
                className="h-[48px] rounded-[14px] border-2 border-transparent bg-card px-3 text-[15px] font-semibold shadow-card">
                <option value="">+ 82 · Auto / Partial</option>
                {AUTO_LANGS.map((l) => <option key={l.code} value={l.code} lang={l.code} dir={l.dir}>{l.label}</option>)}
              </select>
              <AutoNote />
            </div>
          </>)}
          {step === 2 && (<>
            <div className="rise text-center"><Title /></div>
            <div className="mt-2">
              <Bubble>
                <h1 ref={titleRef} tabIndex={-1} className="outline-none font-sans text-[17px] font-semibold">
                  <span className="sr-only">{intro}</span>
                  <span aria-hidden>{intro.slice(0, typed)}{talking && <span className="caret">|</span>}</span>
                </h1>
              </Bubble>
            </div>
            <div className="relative -mx-5 flex flex-1 items-end justify-center"><RomeScene className="absolute inset-x-0 bottom-0 h-[240px] w-full" /><Pino mood={talking ? "speaking" : "idle"} className="relative h-[300px] w-auto" /></div>
          </>)}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-center gap-2">
            <span aria-hidden className="flex gap-1.5">
              {[0, 1, 2].map((i) => <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-primary" : "w-2 bg-input"}`} />)}
            </span>
            <span aria-live="polite" className="text-[12px] font-semibold text-muted-foreground">{t("onb.step", { n: step + 1 })}</span>
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => go(step - 1)} aria-label={t("onb.back")}
                className="press grid size-[52px] shrink-0 place-items-center rounded-full border border-border bg-card text-foreground">
                <ArrowLeft className="size-5 rtl:-scale-x-100" aria-hidden />
              </button>
            )}
            <button type="button" onClick={() => (step < 2 ? go(step + 1) : finish())} disabled={disabled} aria-disabled={disabled}
              className="press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[17px] font-bold text-primary-foreground shadow-card transition-opacity disabled:cursor-not-allowed disabled:opacity-45">
              {cta}
              <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
