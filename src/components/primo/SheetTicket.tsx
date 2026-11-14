import { Printer, Share2, Square } from "lucide-react";
import type { Line } from "./types";
import { FootprintsLogo } from "./icons";
import { useI18n } from "@/i18n/I18nProvider";
import { DICT, type Key } from "@/i18n/dict";

type Props = {
  line: Line; documents: Key[]; sources: { key: Key; date: string }[];
  onShare?: () => void; onPrint?: () => void;
};

export function SheetTicket({ line, documents, sources, onShare, onPrint = () => window.print() }: Props) {
  const { t, lang, dir } = useI18n();
  const k = (s: string) => s as Key;
  const row = (i: number) => ({ ["--i" as string]: i + 4 });
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <div className="overflow-hidden">
        <div id="foglio-stampa" className="print-out ticket-edge overflow-hidden rounded-[20px] bg-ticket shadow-card text-ticket-foreground">
          <div className={`flex items-center gap-2.5 px-4 py-3 text-petrol-foreground bg-petrol`}>
            <FootprintsLogo className="size-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold uppercase tracking-wider">{t("tk.kicker")}</p>
              <h2 className="font-display text-[17px] font-bold leading-tight">{t("tk.title")}</h2>
            </div>
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-ticket font-display text-[18px] font-bold text-ticket-foreground">{line.id}</span>
          </div>
          <div className="rise space-y-0.5 px-4 pt-3" style={row(0)}>
            <p className="text-[12px] font-bold uppercase tracking-wider text-ticket-muted">{t(k(`line.${line.id}.label`))}</p>
            <p className="font-display text-[17px] font-bold">{t(k(`line.${line.id}.name`))}</p>
            <p className="text-[15px]">{t(k(`line.${line.id}.office`))}</p>
          </div>
          <div aria-hidden className="perforation mx-4 my-3" />
          <div className="grid gap-4 px-4 pb-4 text-[15px]">
            <section className="rise" style={row(1)}>
              <h3 className="mb-1.5 font-display text-[15px] font-bold">{t("tk.docs")}</h3>
              <ul className="space-y-1">{documents.map((d) => <li key={d} className="flex items-start gap-2"><Square className="mt-0.5 size-4 shrink-0" aria-hidden /><span>{t(d)}</span></li>)}</ul>
            </section>
            <section className="rise" style={row(2)}>
              <h3 className="mb-1.5 font-display text-[15px] font-bold">{t("tk.steps")}</h3>
              <ol className="list-decimal space-y-0.5 ps-5">{line.stops.map((s) => <li key={s.id}>{t(k(`${s.id}.t`))}{s.done ? ` — ${t("j.done")}` : ""}</li>)}</ol>
            </section>
            <section className="rise rounded-xl border border-dashed border-ticket-muted p-3" style={row(3)}>
              <h3 className="mb-0.5 text-[13px] font-bold">{t("tk.forOperator")}</h3>
              <p lang="it" dir="ltr">“{DICT.it["tk.phrase"]}”</p>
              {lang !== "it" && (<>
                <p className="mt-2 text-[12px] font-bold uppercase tracking-wider text-ticket-muted">{t("tk.inYourLang")}</p>
                <p lang={lang} dir={dir}>{t("tk.phrase")}</p>
              </>)}
            </section>
            <footer className="rise border-t border-ticket-muted/40 pt-2 text-[12px] text-ticket-muted" style={row(4)}>
              <p className="font-bold">{t("tk.sources")}</p>
              <ul>{sources.map((s) => <li key={s.key}>{t(s.key)} — {t("tk.consulted", { date: s.date })}</li>)}</ul>
            </footer>
          </div>
        </div>
      </div>
      <div className="rise grid gap-2 print:hidden" style={row(5)}>
        <button type="button" onClick={onPrint} className="press flex min-h-[52px] items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-[17px] font-bold leading-tight text-primary-foreground">
          <Printer className="size-[18px] shrink-0" aria-hidden /> {t("tk.print")}
        </button>
        <button type="button" onClick={onShare} className="press flex min-h-[52px] items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-[15px] shadow-card font-bold leading-tight text-foreground">
          <Share2 className="size-[18px] shrink-0" aria-hidden /> {t("tk.share")}
        </button>
      </div>
    </div>
  );
}
