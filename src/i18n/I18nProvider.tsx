import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { DICT, type Key, type Lang } from "./dict";
import { ALL_LANGUAGES } from "@/components/primo/types";

type Ctx = { lang: Lang; dir: "ltr" | "rtl"; setLang: (l: string) => void; t: (k: Key, p?: Record<string, string | number>) => string };
const I18nCtx = createContext<Ctx | null>(null);

/** Fade the whole UI between two visual states (language, theme) when supported. */
export function withFade(update: () => void) {
  const d = typeof document !== "undefined" ? (document as Document & { startViewTransition?: (cb: () => void) => unknown }) : null;
  if (d?.startViewTransition) d.startViewTransition(() => flushSync(update));
  else update();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");
  const dir = ALL_LANGUAGES.find((l) => l.code === lang)?.dir ?? "ltr";
  const setLang = useCallback((l: string) => { if (l in DICT) withFade(() => setLangState(l as Lang)); }, []);
  useEffect(() => { document.documentElement.dir = dir; document.documentElement.lang = lang; }, [dir, lang]);
  const t = useCallback((k: Key, p?: Record<string, string | number>) => {
    let s = DICT[lang]?.[k] ?? DICT.it[k] ?? k;
    if (p) for (const [a, b] of Object.entries(p)) s = s.replace(`{${a}}`, String(b));
    return s;
  }, [lang]);
  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}
export type { Key };
