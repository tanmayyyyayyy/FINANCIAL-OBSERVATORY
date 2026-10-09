import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "../components/AuthShell";
import { PasswordField } from "../components/PasswordField";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useAuth } from "../context/AuthContext";
import { firebaseErrorMessage } from "../firebase/errors";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      const rawDestination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      // Only allow relative paths (must start with "/") to prevent open-redirect
      // or javascript: URL injection via location.state.
      const destination = rawDestination && /^\/[^/]/.test(rawDestination)
        ? rawDestination
        : "/dashboard";
      navigate(destination, { replace: true });

    } catch (cause) {
      clearError();
      setError(firebaseErrorMessage(cause, "Unable to sign in. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      mode="login"
      title="Welcome back."
      subtitle="Sign in to see your transactions, budgets, and spending summary."
      footer={
        <>
          Don't have an observatory?{" "}
          <Link to="/signup">Create one</Link>
        </>
      }
    >
      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="auth-form">
        <div>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        <AnimatedButton
          type="submit"
          className="button button-primary auth-submit"
          disabled={isSubmitting}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            {isSubmitting ? "Signing in…" : "Sign in"}
            <ArrowRight size={14} />
          </span>
        </AnimatedButton>
      </form>
    </AuthShell>
  );
}
