import type { Key } from "@/i18n/dict";
import { AUTO_LANGS } from "@/i18n/auto-langs";

export type MicState = "idle" | "listening" | "thinking" | "speaking";
export type ToolCall = { id: string; labelKey: Key; doneKey: Key; status: "running" | "done" };
/** Messages carry either a dictionary key (sample content) or raw user text. */
export type ChatItem =
  | { id: string; kind: "user" | "assistant"; textKey?: Key; text?: string }
  | { id: string; kind: "tool"; tool: ToolCall }
  | { id: string; kind: "typing" };
export type LineId = "A" | "B" | "C";
export type Verification = { kind: "verified"; date: string } | { kind: "unconfirmed" };
/** Stop texts come from the dictionary: `${id}.t`, `${id}.w`, `${id}.b`. */
export type Stop = { id: string; done: boolean; verification?: Verification };
export type Line = { id: LineId; stops: Stop[] };
export type Language = { code: string; label: string; dir: "ltr" | "rtl" };

export const LANGUAGES: Language[] = [
  { code: "it", label: "Italiano", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ro", label: "Română", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "uk", label: "Українська", dir: "ltr" },
  { code: "fil", label: "Filipino", dir: "ltr" },
  { code: "bn", label: "বাংলা", dir: "ltr" },
];

/** All 89 selectable languages: the 7 above are written for the demo, the rest are automatic and partial. */
export const ALL_LANGUAGES: Language[] = [...LANGUAGES, ...AUTO_LANGS];
