import type { ChatItem, Line } from "./types";
import type { Key } from "@/i18n/dict";

export const SAMPLE_CHAT: ChatItem[] = [
  { id: "1", kind: "user", textKey: "chat.1" },
  { id: "t1", kind: "tool", tool: { id: "t1", labelKey: "tool.docs.run", doneKey: "tool.docs.done", status: "done" } },
  { id: "2", kind: "assistant", textKey: "chat.2" },
  { id: "3", kind: "user", textKey: "chat.3" },
  { id: "t2", kind: "tool", tool: { id: "t2", labelKey: "tool.office.run", doneKey: "tool.office.done", status: "done" } },
  { id: "4", kind: "assistant", textKey: "chat.4" },
];

export const SAMPLE_LINES: Line[] = [
  { id: "A", stops: [
    { id: "a1", done: true, verification: { kind: "unconfirmed" } },
    { id: "a2", done: false }, { id: "a3", done: false }, { id: "a4", done: false },
  ] },
  { id: "B", stops: [
    { id: "b1", done: false }, { id: "b2", done: false },
    { id: "b3", done: false, verification: { kind: "verified", date: "13/11/2026" } },
    { id: "b4", done: false },
  ] },
  { id: "C", stops: [
    { id: "c1", done: false, verification: { kind: "unconfirmed" } },
    { id: "c2", done: false, verification: { kind: "unconfirmed" } },
    { id: "c3", done: false, verification: { kind: "unconfirmed" } },
  ] },
];

export const SAMPLE_DOCUMENTS: Key[] = ["doc.1", "doc.2", "doc.3", "doc.4"];
export const SAMPLE_SOURCES: { key: Key; date: string }[] = [
  { key: "src.1", date: "13/11/2026" }, { key: "src.2", date: "13/11/2026" },
];
