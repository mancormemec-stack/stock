import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import type { ChatItem } from "./types";
import { ToolPill } from "./ToolPill";
import { useI18n } from "@/i18n/I18nProvider";

type Props = { items: ChatItem[]; onSend: (text: string) => void };

export function Conversation({ items, onSend }: Props) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };
  return (
    <section aria-labelledby="conv-title" className="flex min-h-full flex-col gap-3 px-1">
      <h2 id="conv-title" className="px-1 font-display text-[22px] font-bold text-petrol dark:text-foreground">{t("conv.title")}</h2>
      <ol role="log" aria-live="polite" aria-relevant="additions" className="flex flex-col gap-2">
        {items.map((m, i) => (
          <li key={m.id} style={{ ["--i" as string]: Math.min(i, 8) }}
            className={`bubble flex ${m.kind === "user" ? "justify-end origin-bottom-right rtl:origin-bottom-left" : "justify-start origin-bottom-left rtl:origin-bottom-right"}`}>
            {m.kind === "tool" ? <ToolPill tool={m.tool} />
              : m.kind === "typing" ? (
                <span className="inline-flex items-center gap-1 rounded-2xl bg-card shadow-card px-3 py-2.5" role="status">
                  <span className="sr-only">{t("conv.typing")}</span>
                  {[0, .15, .3].map((d) => <span key={d} aria-hidden style={{ animationDelay: `${d}s` }} className="typing-dot size-[7px] rounded-full bg-muted-foreground" />)}
                </span>
              ) : m.kind === "user" ? (
                <p className="max-w-[82%] rounded-[18px] rounded-ee-md bg-user px-3 py-2 text-[15px] leading-snug text-user-foreground">
                  <span className="sr-only">{t("conv.you")}: </span>{m.textKey ? t(m.textKey) : m.text}
                </p>
              ) : (
                <p className="max-w-[88%] rounded-[18px] rounded-es-md bg-assistant shadow-card px-3 py-2 text-[15px] leading-snug text-assistant-foreground">
                  <span className="sr-only">Primo Passo: </span>{m.textKey ? t(m.textKey) : m.text}
                </p>
              )}
          </li>
        ))}
      </ol>
      <form onSubmit={submit} className="sticky bottom-0 -mx-1 mt-auto flex gap-2 bg-background px-1 pb-4 pt-2">
        <label htmlFor="msg" className="sr-only">{t("conv.inputLabel")}</label>
        <input id="msg" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("conv.placeholder")}
          className="h-[48px] min-w-0 flex-1 rounded-full border border-border bg-card shadow-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground" />
        <button type="submit" className="press tap flex h-[48px] shrink-0 items-center gap-1.5 rounded-full bg-user px-4 text-[15px] font-bold text-user-foreground">
          <Send className="size-[18px] rtl:-scale-x-100" aria-hidden /> {t("conv.send")}
        </button>
      </form>
    </section>
  );
}
