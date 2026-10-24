import { Link } from "react-router-dom";
import { ObservatoryMark } from "../components/ObservatoryMark";
import { ArrowLeft } from "lucide-react";

const LAST_UPDATED = "October 23, 2026";
const APP_NAME = "Financial Observatory";
const CONTACT_EMAIL = "support@financial-observatory.app";

export function PrivacyPolicy() {
  return (
    <div className="page-wrapper" style={{ minHeight: "100vh", padding: "2rem 1rem 4rem" }}>
      {/* Header */}
      <header style={{ maxWidth: 760, margin: "0 auto 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.85rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft size={14} />
          Back
        </Link>
        <span style={{ color: "var(--border-subtle)", fontSize: "0.85rem" }}>|</span>
        <ObservatoryMark size={22} />
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{APP_NAME}</span>
      </header>

      {/* Content */}
      <article
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "var(--surface-glass)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "1rem",
          padding: "2.5rem 2rem",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2.5rem" }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Introduction">
          <p>
            {APP_NAME} ("we", "us", or "our") is committed to protecting your personal and financial information.
            This Privacy Policy explains what data we collect, how we use it, and your rights as a user of our
            application available at{" "}
            <a href="https://financial-observatory-1b20e.web.app" style={{ color: "var(--accent-indigo)" }}>
              financial-observatory-1b20e.web.app
            </a>{" "}
            and any associated mobile applications.
          </p>
          <p>By using {APP_NAME}, you agree to the collection and use of information as described in this policy.</p>
        </Section>

        <Section title="2. Data We Collect">
          <SubHeading>2.1 Account Information</SubHeading>
          <ul>
            <li>Email address (used for authentication via Firebase Auth)</li>
            <li>Display name (optional, set by you)</li>
            <li>Password hash (stored securely by Firebase — we never see your plain password)</li>
          </ul>

          <SubHeading>2.2 Financial Data (stored in your private account only)</SubHeading>
          <ul>
            <li>Transactions you manually enter: amount, category, date, notes</li>
            <li>Monthly income figures you provide during onboarding or settings</li>
            <li>Budget limits you set per category</li>
            <li>Savings goals you create</li>
            <li>Uploaded receipt images (processed by AI, not stored long-term)</li>
            <li>PDF bank statements you upload for import (processed server-side, not stored)</li>
          </ul>

          <SubHeading>2.3 Usage Data</SubHeading>
          <ul>
            <li>Anonymous crash reports and performance metrics (via Firebase Analytics, if enabled)</li>
            <li>Feature interaction logs (to improve the app) — never tied to your financial data</li>
          </ul>

          <SubHeading>2.4 Device Data</SubHeading>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address (used for rate limiting and abuse prevention only)</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul>
            <li>To provide and operate the Financial Observatory service</li>
            <li>To authenticate your identity and secure your account</li>
            <li>To process your financial entries and display them back to you</li>
            <li>
              To power AI features (receipt scanning, natural language parsing, spending insights) — AI processing
              happens server-side; your Gemini API key is never exposed to the client
            </li>
            <li>To enforce per-user rate limits on AI features to prevent abuse</li>
            <li>To send transactional emails (password reset, account confirmation) — no marketing emails</li>
            <li>To improve the application based on aggregated, anonymized usage patterns</li>
          </ul>
          <p>
            <strong>We do not sell your data.</strong> We do not share your financial data with any third party for
            advertising or marketing purposes.
          </p>
        </Section>

        <Section title="4. Data Storage & Security">
          <ul>
            <li>
              All financial data is stored in <strong>Google Firebase Firestore</strong>, isolated per user. Firestore
              security rules ensure you can only access your own data.
            </li>
            <li>Data is encrypted at rest and in transit (TLS 1.2+).</li>
            <li>API keys for AI services are stored exclusively on our server — never in the app bundle.</li>
            <li>
              Our backend enforces HTTP security headers including Strict-Transport-Security, Content-Security-Policy,
              X-Frame-Options, and Permissions-Policy.
            </li>
            <li>We perform regular dependency audits and keep all libraries up to date.</li>
          </ul>
        </Section>

        <Section title="5. AI Features & Third-Party Processing">
          <p>
            {APP_NAME} uses <strong>Google Gemini AI</strong> to power features such as:
          </p>
          <ul>
            <li>Receipt scanning (image → transaction data)</li>
            <li>Natural language transaction entry</li>
            <li>Spending insights and weekly check-ins</li>
            <li>Ask Your Money conversational AI</li>
          </ul>
          <p>
            When you use these features, relevant data (e.g., the text of your voice entry, or a receipt image) is
            sent to Google's Gemini API via our server. This is governed by{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-indigo)" }}
            >
              Google's Privacy Policy
            </a>
            . We do not retain AI prompts or responses beyond the session.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <ul>
            <li>Your account data is retained as long as your account is active.</li>
            <li>Deleted transactions are removed immediately from Firestore.</li>
            <li>
              If you delete your account, all your data in Firestore is permanently deleted within 30 days.
            </li>
            <li>Anonymized usage analytics may be retained for up to 26 months.</li>
          </ul>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of all data we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Update incorrect data directly in the app (Settings → Profile).
            </li>
            <li>
              <strong>Deletion:</strong> Delete your account and all associated data from within Settings.
            </li>
            <li>
              <strong>Portability:</strong> Export your transactions as CSV from the Ledger page.
            </li>
            <li>
              <strong>Objection:</strong> Opt out of analytics by contacting us.
            </li>
          </ul>
          <p>
            For GDPR (EU), CCPA (California), DPDP (India), or other regional requests, email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-indigo)" }}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            {APP_NAME} is not directed to children under 13 (or under 16 in the EU). We do not knowingly collect
            personal information from children. If you believe a child has provided us data, please contact us and
            we will delete it promptly.
          </p>
        </Section>

        <Section title="9. Cookies & Local Storage">
          <p>We use browser local storage and IndexedDB for:</p>
          <ul>
            <li>Keeping you signed in (Firebase Auth session token)</li>
            <li>Caching UI preferences (theme, dismissed banners)</li>
            <li>Service worker cache for offline functionality (static assets only — no financial data cached)</li>
          </ul>
          <p>We do not use third-party advertising cookies.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date
            at the top. Material changes will be communicated via an in-app banner or email. Continued use of the
            app after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have questions about this Privacy Policy or your data, contact us at:
            <br />
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-indigo)" }}>
              {CONTACT_EMAIL}
            </a>
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            We aim to respond to all privacy-related requests within 30 days.
          </p>
        </Section>

        {/* Footer links */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/terms" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none" }}>
            Terms of Service →
          </Link>
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none" }}>
            Back to Home →
          </Link>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "0.75rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontWeight: 600, color: "var(--text-primary)", marginTop: "0.5rem", marginBottom: "-0.2rem" }}>
      {children}
    </p>
  );
}
