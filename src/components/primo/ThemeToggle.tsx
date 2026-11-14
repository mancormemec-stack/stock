import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

type Props = { theme: "dark" | "light"; onToggle: () => void };

export function ThemeToggle({ theme, onToggle }: Props) {
  const { t } = useI18n();
  const isLight = theme === "light";
  return (
    <button type="button" onClick={onToggle} aria-pressed={!isLight} aria-label={isLight ? t("io.toDark") : t("io.toLight")}
      className="press tap grid size-[40px] place-items-center rounded-[12px] border border-border bg-surface-2 text-foreground">
      <span key={theme} className="pop">{isLight ? <Moon className="size-5" aria-hidden /> : <Sun className="size-5" aria-hidden />}</span>
    </button>
  );
}
