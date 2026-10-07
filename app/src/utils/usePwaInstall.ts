import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function checkIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const isDisplayStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isNavStandalone = Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);
  return isDisplayStandalone || isNavStandalone;
}

export function usePwaInstall() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(checkIsStandalone);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") {
        setIsStandalone(true);
      }
    } catch {
      // User dismissed or browser blocked
    } finally {
      setPromptEvent(null);
    }
  };

  return {
    canInstall: Boolean(promptEvent) && !isStandalone,
    isStandalone,
    installApp,
  };
}
