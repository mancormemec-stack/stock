import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { ChatItem } from "./types";
import { Conversation } from "./Conversation";
import { useI18n } from "@/i18n/I18nProvider";

type Props = { open: boolean; items: ChatItem[]; onSend: (t: string) => void; onClose: () => void };

export function ConversationSheet({ open, items, onSend, onClose }: Props) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) closeRef.current?.focus(); }, [open]);
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ block: "end" }); }, [open, items.length]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={t("conv.title")} onKeyDown={(e) => e.key === "Escape" && onClose()}
      className="sheet-up absolute inset-0 z-30 flex flex-col rounded-t-[24px] bg-background shadow-2xl">
      <button ref={closeRef} type="button" onClick={onClose} aria-label={t("conv.close")}
        className="press flex h-[44px] shrink-0 flex-col items-center justify-center gap-0.5">
        <span aria-hidden className="h-1 w-10 rounded-full bg-border" />
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <Conversation items={items} onSend={onSend} />
        <div ref={endRef} />
      </div>
    </div>
  );
}
