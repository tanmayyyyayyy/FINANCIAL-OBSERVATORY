import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2, Shield, Layers, Target } from "lucide-react";
import { ObservatoryMark } from "../components/ObservatoryMark";
import { useFinancialProfile } from "../context/FinancialProfileContext";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function Onboarding() {
  const navigate = useNavigate();
  const { saveOnboardingFinancials } = useFinancialProfile();
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([
    "Food & Dining",
    "Transport",
    "Utilities",
    "Entertainment",
    "Shopping",
  ]);
  const [budgetLimit, setBudgetLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stepDirection, setStepDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const [saveError, setSaveError] = useState("");
  const [incomeError, setIncomeError] = useState("");
  const [budgetError, setBudgetError] = useState("");

  const categoriesAvailable = [
    "Food & Dining",
    "Transport",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Housing",
    "Health",
    "Education",
  ];

  function goToStep(next: number) {
    setStepDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function toggleCategory(cat: string) {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  }

  async function handleComplete() {
    const parsedIncome = Number(income);
    const parsedBudget = Number(budgetLimit);
    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setBudgetError("Enter a monthly budget greater than zero.");
      return;
    }
    if (parsedBudget > parsedIncome) {
      setBudgetError("Your budget cannot be higher than your income.");
      return;
    }
    setBudgetError("");
    setSaving(true);
    setSaveError("");
    try {
      await saveOnboardingFinancials(Number(income), Number(budgetLimit));
      setCompleted(true);
      await new Promise((resolve) => window.setTimeout(resolve, reduceMotion ? 0 : 420));
      navigate("/dashboard");
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Unable to save your financial profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
      }}
    >
      <div
        className="observatory-card page-hero animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "540px",
          padding: "40px",
          boxShadow: "0 32px 100px rgba(0, 0, 0, 0.85)",
        }}
      >
        <div className="onboarding-brand"><span className="brand-icon-shield"><ObservatoryMark size={21} /></span><span>Financial Observatory</span></div>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "var(--font-mono)",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </Link>

        {/* Progress tracker */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: "3px",
                borderRadius: "2px",
                background:
                  s <= step
                    ? "#ffffff"
                    : "rgba(255, 255, 255, 0.1)",
                transition: "background 200ms ease",
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,.52)", marginTop: "-20px", marginBottom: "24px" }}>
          Step {step} of 3 · about 30 seconds
        </p>

        <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={reduceMotion ? false : { opacity: 0, x: stepDirection * 14 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: stepDirection * -10 }} transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}>
        {step === 1 && (
          <div>
            <div className="eyebrow">
              <Shield size={12} />
              <span>STEP 1 OF 3 / MONTHLY INCOME</span>
            </div>
            <h1 style={{ fontSize: "1.9rem", marginBottom: "8px" }}>
              Start with your income
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "28px" }}>
              Estimate how much money you usually receive each month. It does not need to be exact.
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="onboarding-income">MONTHLY INCOME (INR)</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontWeight: 600,
                  }}
                >
                  ₹
                </span>
                <input
                  id="onboarding-income"
                  type="number"
                  value={income}
                  onChange={(e) => {
                    const nextIncome = e.target.value;
                    setIncome(nextIncome);
                    setBudgetLimit(nextIncome && Number(nextIncome) > 0 ? String(Math.round(Number(nextIncome) * 0.8)) : "");
                    setIncomeError("");
                  }}
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    paddingLeft: "32px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
              </div>
            </div>

            {incomeError && <p role="alert" style={{ color: "var(--accent-neg)", fontSize: "13px", marginBottom: "12px" }}>{incomeError}</p>}
            <button
              type="button"
              className="button button-primary"
              style={{ width: "100%", padding: "12px" }}
              onClick={() => {
                if (!Number.isFinite(Number(income)) || Number(income) <= 0) {
                  setIncomeError("Enter a monthly income greater than zero.");
                  return;
                }
                setIncomeError("");
                goToStep(2);
              }}
            >
              <span>Continue to Categories</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="eyebrow">
              <Layers size={12} />
              <span>STEP 2 OF 3 / CATEGORIES</span>
            </div>
            <h1 style={{ fontSize: "1.9rem", marginBottom: "8px" }}>
              Choose your spending categories
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "24px" }}>
              Choose the core categories you want the observatory to monitor and balance.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
              {categoriesAvailable.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: "var(--font-mono)",
                      cursor: "pointer",
                      border: isSelected
                        ? "1px solid rgba(255, 255, 255, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected
                        ? "rgba(255, 255, 255, 0.12)"
                        : "rgba(255, 255, 255, 0.02)",
                      color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className="button button-secondary"
                style={{ flex: 1, padding: "12px" }}
                onClick={() => goToStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="button button-primary"
                style={{ flex: 2, padding: "12px" }}
                onClick={() => goToStep(3)}
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="eyebrow">
              <Target size={12} />
              <span>STEP 3 OF 3 / MONTHLY BUDGET</span>
            </div>
            <h1 style={{ fontSize: "1.9rem", marginBottom: "8px" }}>
              Set a monthly budget
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "24px" }}>
              Choose a monthly spending limit to help keep expenses on track.
            </p>

            <div style={{ marginBottom: "28px" }}>
              <label htmlFor="onboarding-budget">MONTHLY BUDGET (INR)</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontWeight: 600,
                  }}
                >
                  ₹
                </span>
                <input
                  id="onboarding-budget"
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => { setBudgetLimit(e.target.value); setBudgetError(""); }}
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    paddingLeft: "32px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginTop: "8px" }}>
                Suggested budget: 80% of your income
              </p>
            </div>

            {(budgetError || saveError) && <p role="alert" style={{ color: "var(--accent-neg)", fontSize: "13px", marginBottom: "14px" }}>{budgetError || saveError}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className="button button-secondary"
                style={{ flex: 1, padding: "12px" }}
                onClick={() => goToStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="button button-primary"
                style={{ flex: 2, padding: "12px" }}
                onClick={handleComplete}
                disabled={saving || completed}
              >
                <CheckCircle2 size={15} />
                <span>{completed ? "All set" : saving ? "Saving…" : "Finish setup"}</span>
              </button>
            </div>
          </div>
        )}

        </motion.div>
        </AnimatePresence>

        <button type="button" className="button button-ghost" style={{ width: "100%", marginTop: "14px" }} onClick={() => navigate("/dashboard")}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
