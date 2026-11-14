import { Stethoscope, Home, IdCard } from "lucide-react";
import type { LineId } from "./types";
// Literal class names per path (Tailwind needs them written out).
export const LINE_STYLE: Record<LineId, { bg: string; text: string; border: string; tint: string; icon: string }> = {
  A: { bg: "bg-line-a", text: "text-line-a-text", border: "border-line-a", tint: "bg-peach", icon: "text-primary-text" },
  B: { bg: "bg-line-b", text: "text-line-b-text", border: "border-line-b", tint: "bg-petrol-tint", icon: "text-line-b-text" },
  C: { bg: "bg-line-c", text: "text-line-c-text", border: "border-line-c", tint: "bg-success-tint", icon: "text-ok" },
};
export const LINE_ICON = { A: Stethoscope, B: Home, C: IdCard } as const;
