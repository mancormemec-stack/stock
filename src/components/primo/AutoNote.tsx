import { useI18n } from "@/i18n/I18nProvider";
import { AUTO_NOTE } from "@/i18n/auto-langs";

/** Shown only for the 82 automatic, partial languages: says so in that language. */
export function AutoNote({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const note = AUTO_NOTE[lang];
  if (!note) return null;
  return <p className={`text-[12px] leading-snug text-muted-foreground ${className}`} lang={lang}>{note}</p>;
}
