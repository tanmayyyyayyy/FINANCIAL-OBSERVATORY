import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Automatically signs out the user after a specified period of inactivity.
 * Resets on mouse, pointer, touch, scroll, or keyboard activity.
 */
export function useIdleTimeout(timeoutMs: number = 30 * 60 * 1000) {
  const { user, signOut } = useAuth();
  const timerRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      const now = Date.now();
      // Throttle event processing to at most once per 2 seconds
      if (now - lastActivityRef.current < 2000) return;
      lastActivityRef.current = now;

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        void signOut();
      }, timeoutMs);
    };

    // Initial timer setup
    timerRef.current = window.setTimeout(() => {
      void signOut();
    }, timeoutMs);

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousedown",
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
    };
  }, [user, signOut, timeoutMs]);
}
