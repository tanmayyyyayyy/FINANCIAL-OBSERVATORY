import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "../components/AuthShell";
import { PasswordField } from "../components/PasswordField";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useAuth } from "../context/AuthContext";
import { firebaseErrorMessage } from "../firebase/errors";

export function Signup() {
  const navigate = useNavigate();
  const { signUp, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password && confirmPassword && password !== confirmPassword) {
      setError("Passphrases do not match");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await signUp(email, password, name);
      navigate("/onboarding", { replace: true });
    } catch (cause) {
      clearError();
      setError(firebaseErrorMessage(cause, "Unable to create the account. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      mode="signup"
      title="Create your account."
      subtitle="Your account keeps your transactions and budgets in one place."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="auth-form">
        <div>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            required
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <PasswordField
            id="signup-password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />
          <PasswordField
            id="signup-confirm"
            label="Confirm"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
          />
        </div>

        <AnimatedButton
          type="submit"
          className="button button-primary auth-submit"
          disabled={isSubmitting}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            {isSubmitting ? "Creating account…" : "Create account"}
            <ArrowRight size={14} />
          </span>
        </AnimatedButton>
      </form>
    </AuthShell>
  );
}
