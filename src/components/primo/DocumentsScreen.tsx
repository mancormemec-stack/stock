import { useState } from "react";
import { Check, ChevronRight, CircleDashed, FlaskConical, Plus, Route } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Key } from "@/i18n/dict";
import type { LineId } from "./types";
import { LINE_ICON, LINE_STYLE } from "./lines";
import { Pino } from "./Pino";
import { ScreenHeader } from "./ScreenHeader";
import { SAMPLE_DOCS, DOC_STOPS, docById, docsOfLine, lineOfStop, stopsOfLine, type DocStatus, type SampleDoc } from "./docs-data";

/**
 * CONCEPT MOCKUP of a "Documents" section: invented documents, no upload, no storage, no recognition.
 * Three views: archive (list), by path (documents linked to the steps that need them) and document detail.
 */
type Props = { onOpenPath: (line: LineId) => void };
type View = "list" | "path";
const LINES: LineId[] = ["A", "B", "C"];
const k = (s: string) => s as Key;

function Chip({ status }: { status: DocStatus }) {
  const { t } = useI18n();
  return status === "added" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-ok-bg px-2 py-0.5 text-[12px] font-semibold text-ok">
      <Check className="size-3.5 shrink-0" strokeWidth={3} aria-hidden /> {t("docs.statusAdded")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-warn-bg px-2 py-0.5 text-[12px] font-semibold text-warn">
      <CircleDashed className="size-3.5 shrink-0" aria-hidden /> {t("docs.missing")}
    </span>
  );
}

function AddButton() {
  const { t } = useI18n();
  const [note, setNote] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <button type="button" aria-expanded={note} onClick={() => setNote((v) => !v)}
        className="press flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-primary px-5 text-[16px] font-bold text-primary-text">
        <Plus className="size-5" aria-hidden /> {t("docs.add")}
      </button>
      {note && <p role="status" className="text-[13px] text-muted-foreground">{t("docs.addNote")}</p>}
    </div>
  );
}

function DocRow({ doc, i, onOpen }: { doc: SampleDoc; i: number; onOpen: (id: number) => void }) {
  const { t } = useI18n();
  const ok = doc.status === "added";
  return (
    <button type="button" onClick={() => onOpen(doc.id)} aria-label={t("docs.open", { name: t(doc.key) })} style={{ ["--i" as string]: i }}
      className="rise press flex w-full items-center gap-3 rounded-[18px] bg-card p-3 text-start shadow-card">
      <span aria-hidden className={`grid size-[44px] shrink-0 place-items-center rounded-[12px] ${ok ? "bg-success-tint text-ok" : "bg-surface-2 text-muted-foreground"}`}><doc.Icon className="size-[22px]" strokeWidth={2} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold leading-snug">{t(doc.key)}</span>
        <span className="mt-1 block"><Chip status={doc.status} /></span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-decor rtl:-scale-x-100" aria-hidden />
    </button>
  );
}

/* ---------- 1. Archive ---------- */
function Archive({ onOpen, onOpenPath, onView, view }: { onOpen: (id: number) => void; onOpenPath: (l: LineId) => void; onView: (v: View) => void; view: View }) {
  const { t } = useI18n();
  const ready = SAMPLE_DOCS.filter((d) => d.status === "added");
  const missing = SAMPLE_DOCS.filter((d) => d.status === "missing");
  return (
    <div className="flex flex-col gap-4 pb-4">
      <header className="rise rounded-b-[24px] bg-petrol px-4 pb-5 pt-3 text-petrol-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-text">
          <FlaskConical className="size-3.5" aria-hidden /> {t("docs.concept")}
        </span>
        <h1 className="mt-2 font-display text-[24px] font-bold leading-tight">{t("docs.title")}</h1>
        <p className="mt-0.5 text-[13px] leading-snug opacity-90">{t("docs.sub")}</p>
        <p className="mt-4 text-[14px] font-semibold">{t("docs.summary", { done: ready.length, total: SAMPLE_DOCS.length })}</p>
        <span aria-hidden className="mt-2 block h-[6px] overflow-hidden rounded-full bg-petrol-foreground/20">
          <span className="block h-full origin-left rounded-full bg-primary transition-transform duration-300 rtl:origin-right" style={{ transform: `scaleX(${ready.length / SAMPLE_DOCS.length})` }} />
        </span>
      </header>

      <div role="radiogroup" aria-label={t("docs.title")} className="mx-4 grid grid-cols-2 rounded-full bg-surface-2 p-1">
        {(["list", "path"] as const).map((v) => (
          <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => onView(v)}
            className={`press min-h-[40px] rounded-full px-3 text-[14px] font-bold transition-colors ${view === v ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}>
            {t(v === "list" ? "docs.viewList" : "docs.viewPath")}
          </button>
        ))}
      </div>

      {view === "list" ? (
        <div key="list" className="slide-next flex flex-col gap-4">
          <section aria-labelledby="docs-pino" className="rise mx-4 flex items-start gap-3 rounded-[20px] bg-peach p-3.5" style={{ ["--i" as string]: 1 }}>
            <Pino mood="idle" className="h-[68px] w-auto shrink-0" />
            <div className="min-w-0">
              <h2 id="docs-pino" className="text-[12px] font-bold uppercase tracking-wider text-primary-text">{t("docs.pino")}</h2>
              <p className="mt-0.5 text-[15px] font-semibold leading-snug text-foreground">{t("docs.pinoMsg")}</p>
              <button type="button" onClick={() => onOpenPath("A")} className="press mt-2 inline-flex min-h-[40px] items-center gap-1 rounded-full bg-primary px-4 text-[14px] font-bold text-primary-foreground">
                {t("docs.openPath")} <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
              </button>
            </div>
          </section>

          <section aria-labelledby="docs-ready" className="mx-4 flex flex-col gap-2">
            <h2 id="docs-ready" className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">{t("docs.ready")} · {ready.length}</h2>
            {ready.map((d, i) => <DocRow key={d.id} doc={d} i={i + 2} onOpen={onOpen} />)}
          </section>
          <section aria-labelledby="docs-missing" className="mx-4 flex flex-col gap-2">
            <h2 id="docs-missing" className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">{t("docs.missing")} · {missing.length}</h2>
            {missing.map((d, i) => <DocRow key={d.id} doc={d} i={i + 5} onOpen={onOpen} />)}
          </section>
          <div className="mx-4"><AddButton /></div>
        </div>
      ) : (
        <ByPath onOpen={onOpen} onOpenPath={onOpenPath} />
      )}
      <p className="self-center px-4 text-center text-[12px] text-muted-foreground">{t("docs.concept")} · {t("sample")}</p>
    </div>
  );
}

/* ---------- 3. Documents linked to the path ---------- */
function ByPath({ onOpen, onOpenPath }: { onOpen: (id: number) => void; onOpenPath: (l: LineId) => void }) {
  const { t } = useI18n();
  return (
    <div key="path" className="slide-next mx-4 flex flex-col gap-3">
      {LINES.map((line, i) => {
        const st = LINE_STYLE[line]; const Icon = LINE_ICON[line];
        const { ready, total } = docsOfLine(line);
        return (
          <article key={line} aria-labelledby={`dl-${line}`} className="rise rounded-[20px] bg-card p-4 shadow-card" style={{ ["--i" as string]: i }}>
            <header className="flex items-center gap-3">
              <span aria-hidden className={`grid size-[40px] shrink-0 place-items-center rounded-[12px] ${st.tint} ${st.icon}`}><Icon className="size-5" strokeWidth={2} /></span>
              <div className="min-w-0 flex-1">
                <h2 id={`dl-${line}`} className="font-display text-[18px] font-bold leading-tight"><span className="sr-only">{t(k(`line.${line}.label`))}: </span>{t(k(`line.${line}.name`))}</h2>
                <p className="text-[13px] font-semibold text-muted-foreground">{t("docs.pathCount", { done: ready, total })}</p>
              </div>
              <button type="button" onClick={() => onOpenPath(line)} aria-label={`${t("docs.openPath")}: ${t(k(`line.${line}.name`))}`}
                className="press tap grid size-[40px] shrink-0 place-items-center rounded-full bg-surface-2 text-foreground"><Route className="size-5" aria-hidden /></button>
            </header>
            <span aria-hidden className="mt-3 block h-[4px] overflow-hidden rounded-full bg-surface-2">
              <span className={`block h-full origin-left rounded-full rtl:origin-right ${st.bg}`} style={{ transform: `scaleX(${ready / total})` }} />
            </span>
            <ul className="mt-3 flex flex-col gap-3">
              {stopsOfLine(line).map(({ stopId, docs }) => (
                <li key={stopId}>
                  <p className="text-[14px] font-bold leading-snug">{t(k(`${stopId}.t`))}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {docs.map((d) => (
                      <button key={d.id} type="button" onClick={() => onOpen(d.id)} aria-label={t("docs.open", { name: t(d.key) })}
                        className={`press inline-flex min-h-[36px] items-center gap-1 rounded-full px-3 text-[13px] font-semibold ${d.status === "added" ? "bg-ok-bg text-ok" : "bg-warn-bg text-warn"}`}>
                        {d.status === "added" ? <Check className="size-3.5 shrink-0" strokeWidth={3} aria-hidden /> : <CircleDashed className="size-3.5 shrink-0" aria-hidden />}
                        {t(d.key)}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

/* ---------- 2. Document detail ---------- */
function Specimen({ doc }: { doc: SampleDoc }) {
  const { t } = useI18n();
  if (doc.status === "missing") {
    return (
      <div className="rise mx-4 grid aspect-[1.586/1] place-items-center rounded-[20px] border-2 border-dashed border-input bg-surface-2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <doc.Icon className="size-9" strokeWidth={1.6} aria-hidden />
          <Chip status="missing" />
        </div>
      </div>
    );
  }
  return (
    <div className="rise relative mx-4 aspect-[1.586/1] overflow-hidden rounded-[20px] bg-petrol p-4 text-petrol-foreground shadow-card">
      <doc.Icon aria-hidden className="absolute -end-4 -top-4 size-[110px] opacity-10 rtl:-scale-x-100" strokeWidth={1.4} />
      <div aria-hidden className="relative flex h-full gap-3">
        <div className="w-[34%] rounded-[12px] bg-petrol-foreground/15" />
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          <span className="h-2.5 w-[70%] rounded-full bg-petrol-foreground/35" />
          <span className="h-2 w-full rounded-full bg-petrol-foreground/20" />
          <span className="h-2 w-[85%] rounded-full bg-petrol-foreground/20" />
          <span className="h-2 w-[60%] rounded-full bg-petrol-foreground/20" />
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="-rotate-[18deg] rounded-lg border-2 border-peach/60 px-3 py-0.5 text-[26px] font-extrabold uppercase tracking-[0.18em] text-peach/70">{t("docs.facsimile")}</span>
      </span>
      <span className="sr-only">{t("docs.facsimile")}</span>
    </div>
  );
}

function Detail({ doc, onBack, onOpenPath }: { doc: SampleDoc; onBack: () => void; onOpenPath: (l: LineId) => void }) {
  const { t } = useI18n();
  const stops = DOC_STOPS[doc.id] ?? [];
  return (
    <div className="slide-next flex flex-col gap-4 pb-4">
      <ScreenHeader title={t("docs.detail")} compact={false} onBack={onBack} backLabel={t("onb.back")} />
      <div className="mx-4 flex items-center gap-3">
        <span aria-hidden className={`grid size-[44px] shrink-0 place-items-center rounded-[12px] ${doc.status === "added" ? "bg-success-tint text-ok" : "bg-surface-2 text-muted-foreground"}`}><doc.Icon className="size-[22px]" strokeWidth={2} /></span>
        <h2 className="font-display text-[22px] font-bold leading-tight">{t(doc.key)}</h2>
      </div>
      <Specimen doc={doc} />
      <dl className="rise mx-4 divide-y divide-border rounded-[20px] bg-card shadow-card" style={{ ["--i" as string]: 1 }}>
        <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2"><dt className="text-[15px] font-bold">{t("docs.status")}</dt><dd><Chip status={doc.status} /></dd></div>
        <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2"><dt className="text-[15px] font-bold">{t("docs.expiry")}</dt><dd className="text-end text-[14px] text-muted-foreground">{t("docs.expiryNone")}</dd></div>
      </dl>
      <section aria-labelledby="docs-used" className="rise mx-4" style={{ ["--i" as string]: 2 }}>
        <h3 id="docs-used" className="mb-2 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">{t("docs.usedIn")}</h3>
        <ul className="flex flex-col gap-2">
          {stops.map((stopId) => {
            const line = lineOfStop(stopId); const st = LINE_STYLE[line]; const Icon = LINE_ICON[line];
            return (
              <li key={stopId}>
                <button type="button" onClick={() => onOpenPath(line)} className="press flex w-full items-center gap-3 rounded-[16px] bg-card p-3 text-start shadow-card">
                  <span aria-hidden className={`grid size-[36px] shrink-0 place-items-center rounded-[10px] ${st.tint} ${st.icon}`}><Icon className="size-[18px]" strokeWidth={2} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold text-muted-foreground">{t(k(`line.${line}.label`))}</span>
                    <span className="block text-[15px] font-bold leading-snug">{t(k(`${stopId}.t`))}</span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-decor rtl:-scale-x-100" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="mx-4 flex flex-col gap-2">
        <button type="button" onClick={() => onOpenPath(lineOfStop(stops[0] ?? "a1"))} className="press flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-primary px-5 text-[17px] font-bold text-primary-foreground shadow-card">
          <Route className="size-5" aria-hidden /> {t("docs.openPath")}
        </button>
        {doc.status === "missing" && <AddButton />}
      </div>
      <p className="self-center px-4 text-center text-[12px] text-muted-foreground">{t("docs.concept")} · {t("sample")}</p>
    </div>
  );
}

export function DocumentsScreen({ onOpenPath }: Props) {
  const [view, setView] = useState<View>("list");
  const [openId, setOpenId] = useState<number | null>(null);
  const doc = openId == null ? undefined : docById(openId);
  if (doc) return <Detail key={doc.id} doc={doc} onBack={() => setOpenId(null)} onOpenPath={onOpenPath} />;
  return <Archive view={view} onView={setView} onOpen={setOpenId} onOpenPath={onOpenPath} />;
}
