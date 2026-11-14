import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame, MetroBackdrop } from "@/components/primo/PhoneFrame";
import { TabBar, SCREEN_ORDER, type TabId } from "@/components/primo/TabBar";
import { ScreenHeader } from "@/components/primo/ScreenHeader";
import { TalkScreen, type AskStage } from "@/components/primo/TalkScreen";
import { ConversationSheet } from "@/components/primo/ConversationSheet";
import { JourneyScreen } from "@/components/primo/JourneyScreen";
import { SheetTicket } from "@/components/primo/SheetTicket";
import { MeScreen } from "@/components/primo/MeScreen";
import { DocumentsScreen } from "@/components/primo/DocumentsScreen";
import { Onboarding, type OnboardingResult } from "@/components/primo/Onboarding";
import { DemoPanel, type DemoAction } from "@/components/primo/DemoPanel";
import { LANGUAGES, type ChatItem, type LineId, type MicState } from "@/components/primo/types";
import { SAMPLE_CHAT, SAMPLE_DOCUMENTS, SAMPLE_LINES, SAMPLE_SOURCES } from "@/components/primo/sample-data";
import { I18nProvider, useI18n, withFade } from "@/i18n/I18nProvider";
import type { Key } from "@/i18n/dict";
import { getSimpleReplyKey } from "@/components/primo/simple-reply";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Primo Passo – Le pratiche a Roma, fermata dopo fermata" },
      { name: "description", content: "Assistente vocale per chi arriva a Roma: Anagrafe, ASL e Questura spiegate nella tua lingua." },
      { property: "og:title", content: "Primo Passo – Le pratiche a Roma, fermata dopo fermata" },
      { property: "og:description", content: "Il tuo percorso tra Anagrafe, ASL e Questura come una linea della metro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <I18nProvider><App /></I18nProvider>,
});

const uid = () => Math.random().toString(36).slice(2);
const buzz = () => { if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(10); };

// Demo wiring only: all state lives in React memory. Replace handlers with real logic later.
function App() {
  const { t, lang, setLang } = useI18n();
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [micState, setMicState] = useState<MicState>("idle");
  const [session, setSession] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState<ChatItem[]>(SAMPLE_CHAT);
  const [lines, setLines] = useState(SAMPLE_LINES);
  const [announce, setAnnounce] = useState("");
  const [onboarding, setOnboarding] = useState(true);
  const [profile, setProfile] = useState<OnboardingResult | null>(null);
  const [tab, setTab] = useState<TabId>("parla");
  const [dirAnim, setDirAnim] = useState<"next" | "prev">("next");
  const [compact, setCompact] = useState(false);
  const [journeyLine, setJourneyLine] = useState<LineId>("A");
  const [onbStep, setOnbStep] = useState(0);
  const [onbKey, setOnbKey] = useState(0);
  const [askStage, setAskStage] = useState<AskStage>("name");
  const [menuOpen, setMenuOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const openOnboarding = (step = 0) => { setOnbStep(step); setOnbKey((k) => k + 1); setOnboarding(true); };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark"); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  useEffect(() => {
    const sync = () => document.documentElement.classList.toggle("paused", document.visibilityState !== "visible");
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  const toggleTheme = () => withFade(() => setTheme((x) => (x === "dark" ? "light" : "dark")));

  const goTab = (n: TabId) => {
    const order = SCREEN_ORDER;
    setDirAnim(order.indexOf(n) >= order.indexOf(tab) ? "next" : "prev");
    setTab(n); setCompact(false); scrollRef.current?.scrollTo(0, 0);
  };

  const onStartVoice = () => {
    if (micState === "idle") { buzz(); setSession(true); setMicState("listening"); }
    else setMicState("idle");
  };
  const onStartText = () => { setSession(true); setChatOpen(true); };
  const onEnd = () => { buzz(); setSession(false); setMicState("idle"); setChatOpen(false); };

  const onSimplify = () => {
    if (micState === "listening" || micState === "thinking") return;
    const textKey = getSimpleReplyKey(chat);
    if (!textKey) return;
    setChat((items) => [...items, { id: uid(), kind: "user", textKey: "conv.simplify" },
      { id: uid(), kind: "assistant", textKey }]);
    setSession(true);
  };

  const onSend = (text: string) => {
    const toolId = uid(); const typingId = uid();
    setChat((c) => [...c, { id: uid(), kind: "user", text },
      { id: toolId, kind: "tool", tool: { id: toolId, labelKey: "tool.office.run", doneKey: "tool.office.doneShort", status: "running" } }]);
    setMicState("thinking");
    setTimeout(() => setChat((c) => [...c.map((m) => m.id === toolId && m.kind === "tool" ? { ...m, tool: { ...m.tool, status: "done" as const } } : m),
      { id: typingId, kind: "typing" }]), 1100);
    setTimeout(() => {
      setChat((c) => [...c.filter((m) => m.id !== typingId), { id: uid(), kind: "assistant", textKey: "conv.demoReply" }]);
      setMicState("speaking");
      setTimeout(() => setMicState("idle"), 1600);
    }, 2200);
  };

  const onToggleStop = (lineId: LineId, stopId: string) => {
    setLines((ls) => ls.map((l) => {
      if (l.id !== lineId) return l;
      const stops = l.stops.map((s) => (s.id === stopId ? { ...s, done: !s.done } : s));
      const s = stops.find((x) => x.id === stopId)!;
      setAnnounce(`${t(`line.${l.id}.name` as Key)}: ${t(`${s.id}.t` as Key)} — ${s.done ? t("j.done") : t("j.todo")}. ${t("j.progress", { done: stops.filter((x) => x.done).length, total: stops.length })}`);
      return { ...l, stops };
    }));
  };

  const onShare = async () => {
    const text = `Primo Passo – ${t("line.A.name")}: ${SAMPLE_DOCUMENTS.map((d) => t(d)).join(", ")}`;
    try { if (navigator.share) await navigator.share({ title: t("tk.title"), text }); else window.print(); } catch { /* cancelled */ }
  };

  const onDemo = (a: DemoAction) => {
    if (a === "welcome") return openOnboarding(0);
    if (a === "language") return openOnboarding(1);
    if (a === "intro") return openOnboarding(2);
    setOnboarding(false); setMenuOpen(false);
    if (a === "percorso" || a === "foglio" || a === "documenti" || a === "io") { setChatOpen(false); setSession(false); setMicState("idle"); return goTab(a); }
    goTab("parla"); setAskStage("done"); setMicState(a); setSession(a !== "idle");
  };
  const demoCurrent: DemoAction = onboarding ? (["welcome", "language", "intro"] as const)[onbStep] ?? "welcome" : tab === "parla" ? micState : tab;
  const greeting = profile?.firstName ? t("greetName", { name: profile.firstName }) : t("greetAnon");

  const screen = (() => {
    switch (tab) {
      case "parla": return <TalkScreen greeting={greeting} micState={micState} items={chat} inSession={session} audioOn={audioOn} askStage={askStage}
        canSimplify={getSimpleReplyKey(chat) !== undefined} onSimplify={onSimplify}
        onStartVoice={onStartVoice} onStartText={onStartText} onEnd={onEnd} onOpenConversation={() => setChatOpen(true)}
        onToggleAudio={() => setAudioOn((v) => !v)} onOpenMenu={() => setMenuOpen(true)} onOpenSettings={() => goTab("io")}
        onAnswerName={(n) => { setProfile((pr) => ({ language: lang, isEuCitizen: null, ...pr, firstName: n })); setAskStage("eu"); }}
        onAnswerEu={(v) => { setProfile((pr) => ({ language: lang, firstName: "", ...pr, isEuCitizen: v })); setAskStage("done"); }} />;
      case "percorso": return <JourneyScreen lines={lines} onToggleStop={onToggleStop} initialLine={journeyLine} onOpenSheet={() => goTab("foglio")} onOpenProfile={() => goTab("io")} />;
      case "foglio": return <SheetTicket line={lines[0] ?? SAMPLE_LINES[0]!} documents={SAMPLE_DOCUMENTS} sources={SAMPLE_SOURCES} onShare={onShare} />;
      case "documenti": return <DocumentsScreen onOpenPath={(l) => { setJourneyLine(l); goTab("percorso"); }} />;
      case "io": return <MeScreen language={lang} theme={theme} onLanguageChange={setLang} onToggleTheme={toggleTheme} onRestart={() => openOnboarding(0)} />;
    }
  })();

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center md:gap-10 md:py-6">
      <MetroBackdrop />
      <div className="relative flex w-full min-w-0 flex-col items-center gap-3 md:w-auto">
        <PhoneFrame>
          {onboarding ? (
            <Onboarding key={onbKey} initialStep={onbStep} onStepChange={setOnbStep} language={lang} onLanguageChange={setLang} onComplete={(r) => {
              setProfile(r); setLang(r.language); setAskStage("name"); setOnboarding(false); setDirAnim("next"); setTab("parla");
            }} />
          ) : (
            <div className="flex h-full flex-col">
              <div ref={scrollRef} onScroll={(e) => setCompact(e.currentTarget.scrollTop > 16)} className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                {tab === "io" && <ScreenHeader title={t("title.profilo")} compact={compact} />}
                {tab === "foglio" && <ScreenHeader title={t("title.foglio")} compact={compact} onBack={() => goTab("percorso")} backLabel={t("onb.back")} />}
                <main id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}
                  key={tab} className={`${dirAnim === "next" ? "slide-next" : "slide-prev"} ${tab === "parla" ? "h-full" : tab === "percorso" || tab === "documenti" ? "" : "pt-1"}`}>
                  {screen}
                </main>
              </div>
              <TabBar active={tab} inSession={false} onChange={goTab} onEnd={onEnd} />
              <ConversationSheet open={chatOpen} items={chat} onSend={onSend} onClose={() => setChatOpen(false)} />
              <p className="sr-only" aria-live="polite">{announce}</p>
            </div>
          )}
        </PhoneFrame>
        <p className="hidden text-[13px] font-semibold text-muted-foreground md:block">{t("caption")}</p>
      </div>
      <DemoPanel current={demoCurrent} onAction={onDemo} />
    </div>
  );
}
