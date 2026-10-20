import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY_PRIVACY = "observatory:privacy-mode";
const STORAGE_KEY_AUTO_BG = "observatory:auto-bg-mask";

export function usePrivacyShield() {
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PRIVACY) === "true";
    } catch {
      return false;
    }
  });

  const [autoBackgroundMask, setAutoBackgroundMask] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTO_BG);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  // Apply privacy-mode class to document.body
  useEffect(() => {
    if (isPrivacyMode) {
      document.body.classList.add("privacy-mode");
    } else {
      document.body.classList.remove("privacy-mode");
    }
    try {
      localStorage.setItem(STORAGE_KEY_PRIVACY, String(isPrivacyMode));
    } catch {
      // storage unavailable
    }
  }, [isPrivacyMode]);

  // Multitasking & background blur listener for sensitive financial data
  useEffect(() => {
    if (!autoBackgroundMask) {
      document.body.classList.remove("app-backgrounded");
      return;
    }

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        document.body.classList.add("app-backgrounded");
      } else {
        document.body.classList.remove("app-backgrounded");
      }
    };

    const handleBlur = () => {
      // Lightly mask when window loses focus (e.g. app switcher)
      if (document.visibilityState === "hidden") {
        document.body.classList.add("app-backgrounded");
      }
    };

    const handleFocus = () => {
      document.body.classList.remove("app-backgrounded");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.body.classList.remove("app-backgrounded");
    };
  }, [autoBackgroundMask]);

  // Keyboard shortcut: Shift + P to toggle privacy shield
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.shiftKey &&
        (e.key === "P" || e.key === "p") &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsPrivacyMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyMode((prev) => !prev);
  }, []);

  const toggleAutoBackgroundMask = useCallback(() => {
    setAutoBackgroundMask((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_AUTO_BG, String(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  return {
    isPrivacyMode,
    togglePrivacyMode,
    autoBackgroundMask,
    toggleAutoBackgroundMask,
  };
}
