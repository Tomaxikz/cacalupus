const popoutWindows = new Map<string, Window>();

const WINDOW_FEATURES = 'popup=yes,width=960,height=600,menubar=no,toolbar=no,location=no,status=no';

export default function openConsolePopout(uuidShort: string) {
  const existing = popoutWindows.get(uuidShort);
  if (existing && !existing.closed) {
    existing.focus();
    return existing;
  }

  const popout = window.open(`/server/${uuidShort}/console/popout`, `console-popout-${uuidShort}`, WINDOW_FEATURES);

  if (popout) {
    popoutWindows.set(uuidShort, popout);
    popout.focus();
  }

  return popout;
}
