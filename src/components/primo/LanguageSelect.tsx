import { Languages } from "lucide-react";
import { LANGUAGES } from "./types";
import { AUTO_LANGS } from "@/i18n/auto-langs";
import { useI18n } from "@/i18n/I18nProvider";

type Props = { value: string; onLanguageChange: (code: string) => void };

export function LanguageSelect({ value, onLanguageChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="relative">
      <label htmlFor="lingua" className="sr-only">{t("io.chooseLang")}</label>
      <Languages aria-hidden className="pointer-events-none absolute start-2.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
      <select id="lingua" value={value} onChange={(e) => onLanguageChange(e.target.value)}
        className="h-[40px] appearance-none rounded-[12px] border border-border bg-surface-2 ps-8 pe-3 text-[15px] font-semibold text-foreground">
        <optgroup label="Italiano · English · …">{LANGUAGES.map((l) => <option key={l.code} value={l.code} lang={l.code} dir={l.dir}>{l.label}</option>)}</optgroup>
        <optgroup label="Auto · Partial">{AUTO_LANGS.map((l) => <option key={l.code} value={l.code} lang={l.code} dir={l.dir}>{l.label}</option>)}</optgroup>
      </select>
    </div>
  );
}
