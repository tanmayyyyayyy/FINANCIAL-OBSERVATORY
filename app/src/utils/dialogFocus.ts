const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function containDialogFocus(dialog: HTMLElement): () => void {
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null);
  const items = focusable();
  (items[0] ?? dialog).focus();

  function handleTab(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const current = focusable();
    if (current.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = current[0];
    const last = current[current.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  dialog.addEventListener("keydown", handleTab);
  return () => {
    dialog.removeEventListener("keydown", handleTab);
    previousFocus?.focus();
  };
}
