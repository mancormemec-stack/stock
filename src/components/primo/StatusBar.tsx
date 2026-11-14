// Decorative iOS-like status bar shown only inside the desktop phone frame.
export function StatusBar() {
  return (
    <div aria-hidden className="relative hidden h-[44px] shrink-0 items-center justify-between px-8 pt-1 text-[15px] font-bold text-foreground md:flex">
      <span>9:41</span>
      <span className="absolute left-1/2 top-2 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-[var(--phone-bezel)]" />
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-[18px] fill-current"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4 fill-current"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0L8 11.5Zm-4.2-4.3L2.4 5.8a8 8 0 0 1 11.2 0l-1.4 1.4a6 6 0 0 0-8.4 0ZM.9 4.3-.5 2.9a12 12 0 0 1 17 0l-1.4 1.4a10 10 0 0 0-14.2 0Z"/></svg>
        <svg viewBox="0 0 27 12" className="h-3 w-[27px]"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="17" height="8" rx="1.8" fill="currentColor"/><rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".5"/></svg>
      </span>
    </div>
  );
}
