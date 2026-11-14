import { IdCard, ReceiptText, BadgeCheck, FileSignature, FileText, Stamp, Camera, type LucideIcon } from "lucide-react";
import type { Key } from "@/i18n/dict";
import type { LineId } from "./types";

/**
 * CONCEPT MOCKUP: invented documents, nothing is uploaded, stored or recognised.
 * Names reuse the sample sheet ("doc.1" to "doc.4"); the missing one matches the sample chat
 * ("you only lack the declaration of actual address").
 */
export type DocStatus = "added" | "missing";
export type SampleDoc = { id: number; key: Key; status: DocStatus; Icon: LucideIcon };

export const SAMPLE_DOCS: SampleDoc[] = [
  { id: 1, key: "doc.1", status: "added", Icon: IdCard },
  { id: 2, key: "doc.2", status: "added", Icon: ReceiptText },
  { id: 3, key: "doc.3", status: "added", Icon: BadgeCheck },
  { id: 4, key: "doc.4", status: "missing", Icon: FileSignature },
  { id: 5, key: "doc.5", status: "missing", Icon: FileText },
  { id: 6, key: "doc.6", status: "missing", Icon: Stamp },
  { id: 7, key: "doc.7", status: "missing", Icon: Camera },
];

/** Which path steps each document is needed for (ids as in the sample path: a2, b1, ...). */
export const DOC_STOPS: Record<number, string[]> = {
  1: ["a2", "b1", "c3"],
  2: ["a2", "b1", "c3"],
  3: ["a2"],
  4: ["a2"],
  5: ["b1"],
  6: ["c2"],
  7: ["c3"],
};

export const lineOfStop = (stopId: string): LineId => stopId.charAt(0).toUpperCase() as LineId;
export const docById = (id: number) => SAMPLE_DOCS.find((d) => d.id === id);

/** Documents a path needs, with how many are ready. */
export function docsOfLine(line: LineId) {
  const docs = SAMPLE_DOCS.filter((d) => (DOC_STOPS[d.id] ?? []).some((s) => lineOfStop(s) === line));
  return { docs, ready: docs.filter((d) => d.status === "added").length, total: docs.length };
}
/** Stops of a path with the documents each one needs. */
export function stopsOfLine(line: LineId) {
  const ids = [...new Set(SAMPLE_DOCS.flatMap((d) => (DOC_STOPS[d.id] ?? []).filter((s) => lineOfStop(s) === line)))].sort();
  return ids.map((stopId) => ({ stopId, docs: SAMPLE_DOCS.filter((d) => (DOC_STOPS[d.id] ?? []).includes(stopId)) }));
}
