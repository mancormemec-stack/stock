import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Pino's voice in the demo: the browser's own speech synthesis (text-to-speech). Nothing is sent anywhere.
 * If the device has no voice for the language, Pino simply does not speak (the text is still shown).
 */
const supported = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
const ALIAS: Record<string, string[]> = { fil: ["fil", "tl"], he: ["he", "iw"], id: ["id", "in"], no: ["no", "nb", "nn"] };

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const keys = ALIAS[lang] ?? [lang];
  const voices = window.speechSynthesis.getVoices();
  const ok = voices.filter((v) => keys.includes(v.lang.toLowerCase().replace("_", "-").split("-")[0] ?? ""));
  return ok.find((v) => v.localService) ?? ok[0];
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const token = useRef(0);

  const stop = useCallback(() => {
    token.current++;
    if (supported()) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, lang: string) => {
    if (!supported()) return;
    const my = ++token.current;
    window.speechSynthesis.cancel();
    const go = () => {
      if (my !== token.current) return;
      const voice = pickVoice(lang);
      if (!voice) return; // no voice for this language on this device: stay silent
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice; u.lang = voice.lang; u.rate = 0.95; u.pitch = 1.05;
      u.onstart = () => { if (my === token.current) setSpeaking(true); };
      const end = () => { if (my === token.current) setSpeaking(false); };
      u.onend = end; u.onerror = end;
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length > 0) go();
    else {
      // voices load asynchronously the first time
      const h = () => { window.speechSynthesis.removeEventListener("voiceschanged", h); go(); };
      window.speechSynthesis.addEventListener("voiceschanged", h);
      window.setTimeout(() => { window.speechSynthesis.removeEventListener("voiceschanged", h); go(); }, 800);
    }
  }, []);

  useEffect(() => stop, [stop]);
  return { speak, stop, speaking, supported: supported() };
}
