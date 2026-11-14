import { Check } from "lucide-react";
import type { ToolCall } from "./types";
import { useI18n } from "@/i18n/I18nProvider";

export function ToolPill({ tool }: { tool: ToolCall }) {
  const { t } = useI18n();
  const done = tool.status === "done";
  return (
    <span className={`inline-flex min-h-[28px] items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold transition-colors duration-300 ${done
      ? "bg-ok-bg text-ok" : "bg-petrol-tint text-petrol dark:text-secondary-foreground"}`}>
      {done
        ? <Check key="c" className="pop size-3.5" strokeWidth={3} aria-hidden />
        : <span aria-hidden className="dot-pulse size-2 rounded-full bg-primary" />}
      <span className="sr-only">{done ? t("tool.done") : t("tool.running")}: </span>
      {done ? t(tool.doneKey) : t(tool.labelKey)}
    </span>
  );
}
