import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { firebaseErrorMessage } from "../firebase/errors";

interface AiPreferencesContextValue {
  enabled: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  clearError: () => void;
  setEnabled: (enabled: boolean) => Promise<void>;
}

const AiPreferencesContext = createContext<AiPreferencesContextValue | undefined>(undefined);

export function AiPreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [savedPreference, setSavedPreference] = useState<{ userId: string | null; enabled: boolean }>({ userId: null, enabled: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!userId) {
      setSavedPreference({ userId: null, enabled: false });
      return;
    }
    if (!db) {
      setSavedPreference({ userId, enabled: false });
      setError("Firebase web configuration is incomplete. Add the Firebase web app values to app/.env.");
      return;
    }

    return onSnapshot(
      doc(db, "users", userId),
      (snapshot) => setSavedPreference({
        userId,
        enabled: snapshot.data()?.aiEnabled === true,
      }),
      (cause) => {
        setSavedPreference({ userId, enabled: false });
        setError(firebaseErrorMessage(cause, "Unable to load your AI preference."));
      },
    );
  }, [userId]);

  async function setEnabled(enabled: boolean) {
    if (!userId || !db) throw new Error("Sign in with a configured Firebase account to save this preference.");
    const previousPreference = savedPreference;
    setSaving(true);
    setError(null);
    setSavedPreference({ userId, enabled });
    try {
      await setDoc(doc(db, "users", userId), { aiEnabled: enabled }, { merge: true });
    } catch (cause) {
      setSavedPreference(previousPreference.userId === userId ? previousPreference : { userId, enabled: false });
      const message = firebaseErrorMessage(cause, "Unable to save your AI preference.");
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }

  const loading = Boolean(userId && savedPreference.userId !== userId);
  const enabled = savedPreference.userId === userId && savedPreference.enabled;

  return (
    <AiPreferencesContext.Provider value={{ enabled, loading, saving, error, clearError: () => setError(null), setEnabled }}>
      {children}
    </AiPreferencesContext.Provider>
  );
}

export function useAiPreferences() {
  const context = useContext(AiPreferencesContext);
  if (!context) throw new Error("useAiPreferences must be used within an AiPreferencesProvider");
  return context;
}
