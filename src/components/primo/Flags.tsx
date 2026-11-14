import { FLAG_OF } from "./flag-urls";

/** Round flag next to a language. A flag is a hint (languages are not countries); see flag-urls.ts. */
export function LangMark({ code }: { code: string }) {
  const src = FLAG_OF[code];
  if (!src) return <span aria-hidden className="size-[24px] shrink-0 rounded-full bg-petrol-tint" />;
  return <img src={src} alt="" aria-hidden width={24} height={24} loading="lazy" decoding="async" className="size-[24px] shrink-0 rounded-full border border-border object-cover" />;
}
