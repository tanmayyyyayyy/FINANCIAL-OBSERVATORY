import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { firebaseErrorMessage } from "../firebase/errors";

export interface FinancialProfile {
  monthlyIncome: number;
  monthlyBudget: number;
}

interface FinancialProfileContextValue {
  profile: FinancialProfile;
  error: string | null;
  clearError: () => void;
  saveOnboardingFinancials: (monthlyIncome: number, monthlyBudget: number) => Promise<void>;
}

const EMPTY_PROFILE: FinancialProfile = { monthlyIncome: 0, monthlyBudget: 0 };
const FinancialProfileContext = createContext<FinancialProfileContextValue | undefined>(undefined);

export function FinancialProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [savedProfile, setSavedProfile] = useState<{ userId: string | null; profile: FinancialProfile }>({
    userId: null,
    profile: EMPTY_PROFILE,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!userId) {
      setSavedProfile({ userId: null, profile: EMPTY_PROFILE });
      return;
    }
    if (!db) {
      setError("Firebase web configuration is incomplete. Add the Firebase web app values to app/.env.");
      return;
    }

    return onSnapshot(
      doc(db, "users", userId),
      (snapshot) => {
        const data = snapshot.data();
        const monthlyIncome = data?.monthlyIncome;
        const monthlyBudget = data?.monthlyBudget;
        setSavedProfile({
          userId,
          profile: {
            monthlyIncome: typeof monthlyIncome === "number" && Number.isFinite(monthlyIncome) && monthlyIncome >= 0 ? monthlyIncome : 0,
            monthlyBudget: typeof monthlyBudget === "number" && Number.isFinite(monthlyBudget) && monthlyBudget >= 0 ? monthlyBudget : 0,
          },
        });
      },
      (cause) => setError(firebaseErrorMessage(cause, "Unable to load your financial profile.")),
    );
  }, [userId]);

  async function saveOnboardingFinancials(monthlyIncome: number, monthlyBudget: number) {
    if (!userId || !db) {
      throw new Error("Sign in with a configured Firebase account to save your financial profile.");
    }
    if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0 || !Number.isFinite(monthlyBudget) || monthlyBudget <= 0 || monthlyBudget > monthlyIncome) {
      throw new Error("Enter a monthly income and budget above zero. Your budget cannot be higher than your income.");
    }
    try {
      await setDoc(doc(db, "users", userId), { monthlyIncome, monthlyBudget }, { merge: true });
      setError(null);
    } catch (cause) {
      const message = firebaseErrorMessage(cause, "Unable to save your financial profile.");
      setError(message);
      throw new Error(message);
    }
  }

  const profile = savedProfile.userId === userId ? savedProfile.profile : EMPTY_PROFILE;

  return (
    <FinancialProfileContext.Provider value={{ profile, error, clearError: () => setError(null), saveOnboardingFinancials }}>
      {children}
    </FinancialProfileContext.Provider>
  );
}

export function useFinancialProfile() {
  const context = useContext(FinancialProfileContext);
  if (!context) throw new Error("useFinancialProfile must be used within a FinancialProfileProvider");
  return context;
}
