import { useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./index.css";

/* =========================================================
   SHARED NAVIGATION
========================================================= */

function DashboardNav() {
  return (
    <nav className="dashboard-nav">
      <Link to="/dashboard">Overview</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/ledger">Ledger</Link>
      <Link to="/prediction">Prediction</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}

/* =========================================================
   LANDING
========================================================= */

function Landing() {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <div className="brand">
          FINANCIAL OBSERVATORY
        </div>

        <div className="system-label">
          SMART EXPENSE TRACKER / LOCAL BUILD
        </div>
      </header>

      <section className="landing-hero">
        <p className="eyebrow">
          FINANCIAL INTELLIGENCE SYSTEM
        </p>

        <h1>
          Smart Expense
          <br />
          Intelligence.
        </h1>

        <p className="landing-copy">
          A financial observatory for tracking spending,
          understanding patterns, and forecasting what comes next.
        </p>

        <div className="hero-actions">
          <Link
            to="/login"
            className="button button-primary"
          >
            ENTER OBSERVATORY →
          </Link>

          <Link
            to="/dashboard"
            className="button button-secondary"
          >
            VIEW DASHBOARD
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <span className="feature-number">
            01
          </span>

          <h2>TRACK</h2>

          <p>
            Record expenses, investments and financial movements.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-number">
            02
          </span>

          <h2>UNDERSTAND</h2>

          <p>
            Observe spending patterns across categories and time.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-number">
            03
          </span>

          <h2>FORECAST</h2>

          <p>
            Use historical behaviour to anticipate what's next.
          </p>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    window.location.href = "/dashboard";
  }

  return (
    <main className="auth-page">
      <div className="auth-panel">

        <Link
          to="/"
          className="back-link"
        >
          ← FINANCIAL OBSERVATORY
        </Link>

        <p className="eyebrow">
          FINANCIAL OBSERVER
        </p>

        <h1>
          Welcome back.
        </h1>

        <p className="auth-description">
          Return to your financial observatory.
        </p>

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >
          <label>
            EMAIL ADDRESS
          </label>

          <input
            type="email"
            placeholder="intel@domain.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label>
            PASSPHRASE
          </label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button
            type="submit"
            className="button button-primary"
          >
            SIGN IN →
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Create one
          </Link>
        </p>

      </div>
    </main>
  );
}

/* =========================================================
   SIGN UP
========================================================= */

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    window.location.href = "/onboarding";
  }

  return (
    <main className="auth-page">
      <div className="auth-panel">

        <Link
          to="/"
          className="back-link"
        >
          ← FINANCIAL OBSERVATORY
        </Link>

        <p className="eyebrow">
          FINANCIAL OBSERVER INTEL
        </p>

        <h1>
          Build your
          <br />
          financial
          <br />
          observatory.
        </h1>

        <p className="auth-description">
          Create your account and start understanding
          your financial behaviour.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSignup}
        >
          <label>
            FULL NAME
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />

          <label>
            EMAIL
          </label>

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label>
            PASSWORD
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <label>
            CONFIRM PASSWORD
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />

          <button
            type="submit"
            className="button button-primary"
          >
            CREATE ACCOUNT →
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
}

/* =========================================================
   ONBOARDING
========================================================= */

function Onboarding() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      number: "01",
      title: "Financial profile",
      description:
        "Establish the baseline for your financial observatory.",
    },
    {
      number: "02",
      title: "Expense categories",
      description:
        "Choose the categories that describe your spending.",
    },
    {
      number: "03",
      title: "Monthly budget",
      description:
        "Set the spending limit you want the observatory to monitor.",
    },
  ];

  if (step > 3) {
    return (
      <main className="onboarding">
        <p className="eyebrow">
          OBSERVATORY INITIALIZED
        </p>

        <h1>
          Your observatory
          <br />
          is ready.
        </h1>

        <p className="hero-copy">
          Your financial intelligence system has been
          configured successfully.
        </p>

        <div className="onboarding-actions">
          <Link
            to="/dashboard"
            className="button button-primary"
          >
            ENTER OBSERVATORY →
          </Link>
        </div>
      </main>
    );
  }

  const current = steps[step - 1];

  return (
    <main className="onboarding">

      <Link
        to="/"
        className="back-link"
      >
        ← FINANCIAL OBSERVATORY
      </Link>

      <p className="eyebrow">
        OBSERVATORY INITIALIZATION / {current.number}
      </p>

      <h1>
        {current.title}
      </h1>

      <p className="hero-copy">
        {current.description}
      </p>

      <div className="onboarding-progress">
        {steps.map((item, index) => (
          <div
            key={item.number}
            className={
              index + 1 <= step
                ? "onboarding-step active"
                : "onboarding-step"
            }
          >
            {item.number}
          </div>
        ))}
      </div>

      <div className="onboarding-actions">

        <button
          type="button"
          className="button button-primary"
          onClick={() => setStep(step + 1)}
        >
          {step === 3
            ? "INITIALIZE OBSERVATORY →"
            : "CONTINUE →"}
        </button>

      </div>
    </main>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  return (
    <main className="dashboard">

      <header className="dashboard-header">

        <div>
          <p className="eyebrow">
            FINANCIAL OBSERVATORY
          </p>

          <h1>
            Good evening, Tanmay.
          </h1>
        </div>

        <Link
          to="/add-expense"
          className="button button-primary"
        >
          + ADD EXPENSE
        </Link>

      </header>

      <DashboardNav />

      <section className="dashboard-grid">

        <div className="stat-card">
          <span>
            TOTAL SPENDING
          </span>

          <strong>
            ₹14,285
          </strong>

          <small>
            THIS MONTH
          </small>
        </div>

        <div className="stat-card">
          <span>
            MONTHLY BUDGET
          </span>

          <strong>
            ₹25,000
          </strong>

          <small>
            57% UTILIZED
          </small>
        </div>

        <div className="stat-card">
          <span>
            PROJECTED SPEND
          </span>

          <strong>
            ₹21,450
          </strong>

          <small>
            NEXT MONTH
          </small>
        </div>

        <div className="stat-card">
          <span>
            SAVINGS RATE
          </span>

          <strong>
            32.4%
          </strong>

          <small>
            +4.2% VS LAST MONTH
          </small>
        </div>

      </section>

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              RECENT ACTIVITY
            </p>

            <h2>
              Transaction ledger.
            </h2>
          </div>

          <Link to="/ledger">
            VIEW ALL →
          </Link>

        </div>

        <div className="transaction-list">

          <div className="transaction">
            <span>
              Food & Dining
            </span>

            <strong>
              −₹840
            </strong>
          </div>

          <div className="transaction">
            <span>
              Transport
            </span>

            <strong>
              −₹320
            </strong>
          </div>

          <div className="transaction">
            <span>
              Entertainment
            </span>

            <strong>
              −₹1,200
            </strong>
          </div>

          <div className="transaction">
            <span>
              Utilities
            </span>

            <strong>
              −₹2,450
            </strong>
          </div>

        </div>

      </section>

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              INTELLIGENCE
            </p>

            <h2>
              What happens next?
            </h2>
          </div>

        </div>

        <div className="intelligence-card">

          <p>
            Based on your current spending behaviour,
            your projected monthly expenditure is
          </p>

          <strong>
            ₹21,450
          </strong>

          <p>
            You are currently on track to remain within
            your monthly budget.
          </p>

          <Link to="/prediction">
            VIEW PREDICTION ENGINE →
          </Link>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   BUDGETS
========================================================= */

function Budgets() {
  const budgets = [
    {
      category: "Food & Dining",
      spent: 4200,
      limit: 6000,
    },
    {
      category: "Transport",
      spent: 2100,
      limit: 3000,
    },
    {
      category: "Entertainment",
      spent: 4800,
      limit: 4000,
    },
    {
      category: "Shopping",
      spent: 1800,
      limit: 3500,
    },
    {
      category: "Utilities",
      spent: 2450,
      limit: 3000,
    },
  ];

  const alerts = [
    {
      type: "OVER BUDGET",
      text:
        "Entertainment spending has exceeded your monthly limit.",
    },
    {
      type: "ATTENTION",
      text:
        "Utilities are approaching 85% of the configured budget.",
    },
    {
      type: "ON TRACK",
      text:
        "Shopping spending is currently well below your monthly limit.",
    },
  ];

  return (
    <main className="dashboard">

      <div className="page-top">

        <div>
          <p className="eyebrow">
            FINANCIAL OBSERVATORY
          </p>

          <h1>
            Budget control.
          </h1>

          <p className="hero-copy">
            Monitor your spending limits and identify
            where your money is moving.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← OBSERVATORY
        </Link>

      </div>

      <DashboardNav />

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              MONTHLY CONTROL
            </p>

            <h2>
              Your budgets.
            </h2>
          </div>

          <span className="mono-meta">
            AUGUST 2026
          </span>

        </div>

        <div className="budget-list">

          {budgets.map((budget) => {
            const percentage =
              (budget.spent / budget.limit) * 100;

            const isOver =
              budget.spent > budget.limit;

            return (
              <div
                className="budget-row"
                key={budget.category}
              >

                <div className="budget-row-top">

                  <span>
                    {budget.category}
                  </span>

                  <strong
                    className={
                      isOver ? "over" : ""
                    }
                  >
                    ₹{budget.spent.toLocaleString("en-IN")}{" "}
                    / ₹{budget.limit.toLocaleString("en-IN")}
                  </strong>

                </div>

                <div className="budget-bar">

                  <div
                    className={`budget-bar-fill ${isOver ? "over" : ""
                      }`}
                    style={{
                      width: `${Math.min(
                        percentage,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>

      </section>

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              INTELLIGENCE
            </p>

            <h2>
              Budget alerts.
            </h2>
          </div>

        </div>

        <div className="alert-list">

          {alerts.map((alert, index) => (
            <div
              className="alert-item"
              key={index}
            >
              <span>
                {alert.type}
              </span>

              <p>
                {alert.text}
              </p>
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function Settings() {
  const [name, setName] =
    useState("Tanmay Jain");

  const [email, setEmail] =
    useState("tanmay@example.com");

  const [categories, setCategories] =
    useState([
      "Food & Dining",
      "Transport",
      "Entertainment",
      "Shopping",
      "Utilities",
    ]);

  const [newCategory, setNewCategory] =
    useState("");

  const [notifications, setNotifications] =
    useState(true);

  const [weeklyInsights, setWeeklyInsights] =
    useState(true);

  function addCategory() {
    const trimmed =
      newCategory.trim();

    if (!trimmed) {
      return;
    }

    if (!categories.includes(trimmed)) {
      setCategories([
        ...categories,
        trimmed,
      ]);
    }

    setNewCategory("");
  }

  function removeCategory(
    category: string
  ) {
    setCategories(
      categories.filter(
        (item) => item !== category
      )
    );
  }

  function saveProfile(
    event: React.FormEvent
  ) {
    event.preventDefault();

    alert("Profile changes saved.");
  }

  return (
    <main className="dashboard">

      <div className="page-top">

        <div>
          <p className="eyebrow">
            FINANCIAL OBSERVATORY
          </p>

          <h1>
            Settings.
          </h1>

          <p className="hero-copy">
            Configure your financial observatory
            and personal intelligence preferences.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← OBSERVATORY
        </Link>

      </div>

      <DashboardNav />

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              PROFILE
            </p>

            <h2>
              Personal information.
            </h2>
          </div>

        </div>

        <form
          className="settings-form"
          onSubmit={saveProfile}
        >

          <label>
            FULL NAME
          </label>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            type="text"
          />

          <label>
            EMAIL ADDRESS
          </label>

          <input
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            type="email"
          />

          <button
            type="submit"
            className="button button-primary"
          >
            SAVE CHANGES →
          </button>

        </form>

      </section>

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              CATEGORIES
            </p>

            <h2>
              Expense categories.
            </h2>
          </div>

        </div>

        <div className="category-tags">

          {categories.map(
            (category) => (
              <div
                className="category-tag"
                key={category}
              >

                <span>
                  {category}
                </span>

                <button
                  type="button"
                  aria-label={`Remove ${category}`}
                  onClick={() =>
                    removeCategory(category)
                  }
                >
                  ×
                </button>

              </div>
            )
          )}

        </div>

        <form
          className="category-add-form"
          onSubmit={(event) => {
            event.preventDefault();
            addCategory();
          }}
        >

          <input
            value={newCategory}
            onChange={(event) =>
              setNewCategory(
                event.target.value
              )
            }
            placeholder="New category"
            type="text"
          />

          <button
            type="submit"
            className="button button-secondary"
          >
            ADD CATEGORY
          </button>

        </form>

      </section>

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              PREFERENCES
            </p>

            <h2>
              Intelligence settings.
            </h2>
          </div>

        </div>

        <div className="settings-toggle-row">

          <div>
            <strong>
              Spending alerts
            </strong>

            <p>
              Receive alerts when spending
              approaches a budget.
            </p>
          </div>

          <button
            type="button"
            className={`toggle-button ${notifications ? "on" : ""
              }`}
            onClick={() =>
              setNotifications(
                !notifications
              )
            }
          >
            {notifications
              ? "ON"
              : "OFF"}
          </button>

        </div>

        <div className="settings-toggle-row">

          <div>
            <strong>
              Weekly intelligence
            </strong>

            <p>
              Generate a weekly summary
              of your financial behaviour.
            </p>
          </div>

          <button
            type="button"
            className={`toggle-button ${weeklyInsights ? "on" : ""
              }`}
            onClick={() =>
              setWeeklyInsights(
                !weeklyInsights
              )
            }
          >
            {weeklyInsights
              ? "ON"
              : "OFF"}
          </button>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   ADD EXPENSE
========================================================= */

function AddExpense() {
  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Food & Dining");

  const [description, setDescription] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  function handleExpense(
    event: React.FormEvent
  ) {
    event.preventDefault();

    window.location.href =
      "/transaction-success";
  }

  return (
    <main className="form-page">

      <Link
        to="/dashboard"
        className="back-link"
      >
        ← OBSERVATORY
      </Link>

      <p className="eyebrow">
        TRANSACTION INTELLIGENCE
      </p>

      <h1>
        Record a transaction.
      </h1>

      <p className="hero-copy">
        Log the movement. We'll handle the intelligence.
      </p>

      <form
        className="expense-form"
        onSubmit={handleExpense}
      >

        <label>
          AMOUNT
        </label>

        <input
          className="amount-input"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(event) =>
            setAmount(
              event.target.value
            )
          }
          required
        />

        <label>
          CATEGORY
        </label>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
        >
          <option>
            Food & Dining
          </option>

          <option>
            Transport
          </option>

          <option>
            Utilities
          </option>

          <option>
            Entertainment
          </option>

          <option>
            Shopping
          </option>
        </select>

        <label>
          DESCRIPTION
        </label>

        <input
          type="text"
          placeholder="What was this expense for?"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
        />

        <label>
          PAYMENT METHOD
        </label>

        <select
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(
              event.target.value
            )
          }
        >
          <option>
            UPI
          </option>

          <option>
            Credit Card
          </option>

          <option>
            Debit Card
          </option>

          <option>
            Cash
          </option>
        </select>

        <button
          type="submit"
          className="button button-primary"
        >
          RECORD EXPENSE →
        </button>

      </form>

    </main>
  );
}

/* =========================================================
   TRANSACTION SUCCESS
========================================================= */

function TransactionSuccess() {
  return (
    <main className="success-page">

      <p className="eyebrow">
        TRANSACTION RECORDED
      </p>

      <h1>
        Movement logged.
      </h1>

      <p className="hero-copy">
        Your transaction has been added to the observatory.
      </p>

      <Link
        to="/dashboard"
        className="button button-primary"
      >
        RETURN TO OBSERVATORY →
      </Link>

    </main>
  );
}

/* =========================================================
   LEDGER
========================================================= */

function Ledger() {
  const transactions = [
    ["Food & Dining", "₹840"],
    ["Transport", "₹320"],
    ["Entertainment", "₹1,200"],
    ["Utilities", "₹2,450"],
    ["Shopping", "₹1,890"],
    ["Food & Dining", "₹560"],
  ];

  return (
    <main className="dashboard">

      <div className="page-top">

        <div>
          <p className="eyebrow">
            TRANSACTION INTELLIGENCE
          </p>

          <h1>
            Detailed ledger.
          </h1>

          <p className="hero-copy">
            Review the financial movements recorded
            in your observatory.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← OBSERVATORY
        </Link>

      </div>

      <DashboardNav />

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              TRANSACTIONS
            </p>

            <h2>
              Recent movements.
            </h2>
          </div>

          <Link to="/add-expense">
            + ADD EXPENSE
          </Link>

        </div>

        <div className="transaction-list large">

          {transactions.map(
            ([category, amount], index) => (
              <div
                className="transaction"
                key={index}
              >

                <span>
                  {category}
                </span>

                <strong>
                  −{amount}
                </strong>

              </div>
            )
          )}

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   PREDICTION
========================================================= */

function Prediction() {
  return (
    <main className="dashboard">

      <div className="page-top">

        <div>
          <p className="eyebrow">
            FINANCIAL INTELLIGENCE ENGINE
          </p>

          <h1>
            Prediction engine.
          </h1>

          <p className="hero-copy">
            Use your historical spending behaviour
            to anticipate what's coming next.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← OBSERVATORY
        </Link>

      </div>

      <DashboardNav />

      <section className="dashboard-section">

        <div className="prediction-card">

          <span>
            PROJECTED NEXT MONTH SPEND
          </span>

          <strong>
            ₹21,450
          </strong>

          <p>
            Current behaviour suggests your spending
            will remain within the configured monthly budget.
          </p>

          <div className="prediction-meta">
            <div>
              <span>
                MONTHLY BUDGET
              </span>

              <strong>
                ₹25,000
              </strong>
            </div>

            <div>
              <span>
                PROJECTED UTILIZATION
              </span>

              <strong>
                85.8%
              </strong>
            </div>

            <div>
              <span>
                CONFIDENCE
              </span>

              <strong>
                HIGH
              </strong>
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   APP ROUTER
========================================================= */

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/onboarding"
          element={<Onboarding />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/budgets"
          element={<Budgets />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/add-expense"
          element={<AddExpense />}
        />

        <Route
          path="/transaction-success"
          element={<TransactionSuccess />}
        />

        <Route
          path="/ledger"
          element={<Ledger />}
        />

        <Route
          path="/prediction"
          element={<Prediction />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}