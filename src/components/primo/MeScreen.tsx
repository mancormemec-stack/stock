import { RotateCcw, Info, ChevronRight } from "lucide-react";
import { LanguageSelect } from "./LanguageSelect";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "@/i18n/I18nProvider";

type Props = { language: string; theme: "dark" | "light"; onLanguageChange: (c: string) => void; onToggleTheme: () => void; onRestart: () => void };

export function MeScreen({ language, theme, onLanguageChange, onToggleTheme, onRestart }: Props) {
  const { t } = useI18n();
  const row = "flex min-h-[60px] items-center justify-between gap-3 px-4 py-2";
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="rise divide-y divide-border overflow-hidden rounded-[20px] bg-card shadow-card">
        <div className={row}><span className="text-[15px] font-bold">{t("io.language")}</span><LanguageSelect value={language} onLanguageChange={onLanguageChange} /></div>
        <div className={row}>
          <span className="flex flex-col"><span className="text-[15px] font-bold">{t("io.theme")}</span><span className="text-[13px] text-muted-foreground">{theme === "light" ? t("io.light") : t("io.dark")}</span></span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <button type="button" onClick={onRestart} className={`press ${row} w-full text-start`}>
          <span className="flex items-center gap-3 text-[15px] font-bold">
            <span aria-hidden className="grid size-[36px] place-items-center rounded-[10px] bg-peach text-primary-text"><RotateCcw className="size-[18px] rtl:-scale-x-100" /></span>
            {t("io.retry")}
          </span>
          <ChevronRight className="size-5 text-decor rtl:-scale-x-100" aria-hidden />
        </button>
      </div>
      <div className="rise flex gap-2.5 rounded-[16px] bg-petrol-tint p-3 text-[13px] text-petrol dark:text-secondary-foreground" style={{ ["--i" as string]: 1 }}>
        <Info className="mt-0.5 size-[18px] shrink-0" aria-hidden />
        <div className="space-y-1"><p>{t("privacy")}</p><p className="font-bold">{t("sample")}</p></div>
      </div>
    </div>
  );
}
