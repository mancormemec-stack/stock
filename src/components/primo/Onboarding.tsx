import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ArrowRight, ArrowLeft, Search, Volume2 } from "lucide-react";
import { LANGUAGES } from "./types";
import { AUTO_LANGS } from "@/i18n/auto-langs";
import { AutoNote } from "./AutoNote";
import { Pino } from "./Pino";
import { RomeScene } from "./RomeScene";
import { LangMark } from "./Flags";
import { useSpeech } from "./useSpeech";
import { useI18n } from "@/i18n/I18nProvider";

export type OnboardingResult = { language: string; firstName: string; isEuCitizen: boolean | null };
type Props = {
  language: string; onLanguageChange: (code: string) => void; onComplete: (r: OnboardingResult) => void;
  initialStep?: number; onStepChange?: (step: number) => void;
};

const HELLOS = ["Ciao!", "Hello!", "Bună!", "مرحبا!", "Привіт!", "Kumusta!"];
const ONB_LANGS = LANGUAGES.filter((l) => l.code !== "bn");
const CORE_EN: Record<string, string> = { it: "Italian", en: "English", ro: "Romanian", ar: "Arabic", uk: "Ukrainian", fil: "Filipino", bn: "Bengali" };
type Row = { code: string; label: string; english: string; dir: "ltr" | "rtl" };
/** Languages shown in the scrolling list: Bengali (written for the demo) + the 82 automatic ones. */
const OTHER_LANGS: Row[] = [
  ...LANGUAGES.filter((l) => l.code === "bn").map((l) => ({ code: l.code, label: l.label, english: CORE_EN[l.code] ?? l.code, dir: l.dir })),
  ...AUTO_LANGS,
];
const norm = (x: string) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const matches = (l: Row, q: string) => !q || norm(`${l.label} ${l.english} ${l.code}`).includes(q);
const AUTO_CODES = new Set(AUTO_LANGS.map((l) => l.code));
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
  const [query, setQuery] = useState("");
  const [run, setRun] = useState(0);
  const voice = useSpeech();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const intro = t("pino.intro");

  useEffect(() => { titleRef.current?.focus(); onStepChange?.(step); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step !== 0) return;
    const id = setInterval(() => { if (!document.hidden) setHello((h) => (h + 1) % HELLOS.length); }, 2000);
    return () => clearInterval(id);
  }, [step]);
  useEffect(() => {
    if (step !== 2) { voice.stop(); return; }
    // Pino really speaks (browser voice for the chosen language; the 82 automatic languages have an English intro).
    voice.speak(intro, AUTO_CODES.has(language) ? "en" : language);
    if (reduced()) { setTyped(intro.length); return; }
    setTyped(0);
    const id = setInterval(() => setTyped((n) => { if (n >= intro.length) { clearInterval(id); return n; } return n + 1; }), 55);
    return () => clearInterval(id);
  }, [step, intro, run]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = norm(query.trim());
  const shownRows: Row[] = q ? [...ONB_LANGS.map((l) => ({ code: l.code, label: l.label, english: CORE_EN[l.code] ?? l.code, dir: l.dir })), ...OTHER_LANGS].filter((l) => matches(l, q)) : OTHER_LANGS;
  const pick = (code: string) => { onLanguageChange(code); setPicked(true); setHop((h) => h + 1); };
  const go = (n: number) => { setDirAnim(n > step ? "next" : "prev"); setStep(n); };
  const finish = () => onComplete({ language, firstName: "", isEuCitizen: null });
  const talking = step === 2 && (typed < intro.length || voice.speaking);
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
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
              <input id="cerca-lingua" type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off"
                placeholder={t("onb.search")} aria-label={t("onb.search")}
                className="h-[48px] w-full rounded-[14px] border-2 border-transparent bg-card ps-10 pe-3 text-[15px] font-semibold shadow-card outline-none placeholder:font-medium placeholder:text-muted-foreground focus-visible:border-primary" />
            </div>
            {!q && (
              <div role="radiogroup" aria-label={t("onb.t1")} className="grid grid-cols-2 gap-2.5">
                {ONB_LANGS.map((l, i) => {
                  const sel = picked && l.code === language;
                  return (
                    <button key={l.code} type="button" role="radio" aria-checked={sel} lang={l.code}
                      onClick={() => pick(l.code)} style={{ ["--i" as string]: i }}
                      className={`rise press relative flex min-h-[56px] items-center gap-2.5 rounded-[16px] border-2 px-3 py-2 text-[16px] font-bold shadow-card transition-colors duration-200 ${sel ? "tile-pop border-primary bg-peach" : "border-transparent bg-card"}`}>
                      <LangMark code={l.code} />
                      <span dir={l.dir} className="min-w-0 flex-1 text-left">{l.label}</span>
                      {sel && <span aria-hidden className="pop grid size-[22px] shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3.5" strokeWidth={3} /></span>}
                    </button>
                  );
                })}
              </div>
            )}
            <div role="radiogroup" aria-label={t("onb.search")} className="max-h-[230px] overflow-y-auto overscroll-contain rounded-[16px] bg-card shadow-card">
              {shownRows.map((l) => {
                const sel = picked && l.code === language;
                return (
                  <button key={l.code} type="button" role="radio" aria-checked={sel} lang={l.code} onClick={() => pick(l.code)}
                    className={`press flex min-h-[48px] w-full items-center gap-3 border-b border-border px-3 py-2 text-[15px] font-semibold last:border-b-0 ${sel ? "bg-peach" : ""}`}>
                    <LangMark code={l.code} />
                    <span dir={l.dir} className="min-w-0 flex-1 text-left">{l.label}{l.english !== l.label && <small className="ms-2 text-[12px] font-medium text-muted-foreground" dir="ltr">{l.english}</small>}</span>
                    {sel && <span aria-hidden className="grid size-[20px] shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" strokeWidth={3} /></span>}
                  </button>
                );
              })}
              {shownRows.length === 0 && <p role="status" className="px-3 py-4 text-center text-[14px] text-muted-foreground">{t("onb.noResults")}</p>}
            </div>
            <AutoNote />
          </>)}
          {step === 2 && (<>
            <div className="rise text-center"><Title /></div>
            <div className="mt-2">
              <Bubble>
                <button type="button" onClick={() => setRun((n) => n + 1)} aria-label={t("onb.replay")}
                  className="press absolute -end-2 -top-2 grid size-[36px] place-items-center rounded-full bg-primary text-primary-foreground shadow-card">
                  <Volume2 className="size-[18px]" aria-hidden />
                </button>
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
