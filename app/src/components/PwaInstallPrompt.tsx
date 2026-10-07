import { useState } from "react";
import { Download } from "lucide-react";
import { usePwaInstall } from "../utils/usePwaInstall";

export function PwaInstallPrompt() {
  const { canInstall, installApp } = usePwaInstall();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("fo_pwa_install_dismissed") === "true";
    } catch {
      return false;
    }
  });

  if (!canInstall || dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem("fo_pwa_install_dismissed", "true");
    } catch {
      // storage unavailable
    }
    setDismissed(true);
  };

  const handleInstall = async () => {
    await installApp();
  };

  return (
    <aside
      className="pwa-install-banner animate-slide-up"
      role="region"
      aria-label="Install Financial Observatory application"
    >
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          <Download size={16} />
        </div>
        <div className="pwa-install-text">
          <strong>Install Financial Observatory</strong>
          <p>Add Quick Add to your home screen for faster expense tracking.</p>
        </div>
      </div>
      <div className="pwa-install-actions">
        <button
          type="button"
          onClick={handleInstall}
          className="button button-primary pwa-install-btn"
        >
          Install
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="button button-ghost pwa-dismiss-btn"
        >
          Not now
        </button>
      </div>
    </aside>
  );
}
