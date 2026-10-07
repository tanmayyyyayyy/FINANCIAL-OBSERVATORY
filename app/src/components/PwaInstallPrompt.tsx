import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "financial-observatory:pwa-install-dismissed";

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try { setDismissed(localStorage.getItem(DISMISSED_KEY) === "true"); } catch { setDismissed(false); }
    const media = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      media.removeEventListener("change", updateMobile);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try { localStorage.setItem(DISMISSED_KEY, "true"); } catch { /* Storage can be unavailable in private browsing. */ }
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === "dismissed") dismiss();
  }

  if (!isMobile || dismissed || !installEvent) return null;
  return <aside className="pwa-install-prompt" aria-label="Install Financial Observatory">
    <span className="pwa-install-icon"><Download size={17} aria-hidden="true" /></span>
    <span className="pwa-install-copy"><strong>Add Financial Observatory</strong><small>Quick Add from your home screen</small></span>
    <button className="pwa-install-action" type="button" onClick={() => void install()}>Install</button>
    <button className="pwa-install-dismiss" type="button" onClick={dismiss} aria-label="Not now"><X size={17} /></button>
  </aside>;
}
