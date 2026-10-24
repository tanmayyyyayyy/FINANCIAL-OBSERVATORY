import { Link } from "react-router-dom";
import { ObservatoryMark } from "../components/ObservatoryMark";
import { ArrowLeft } from "lucide-react";

const LAST_UPDATED = "October 23, 2026";
const APP_NAME = "Financial Observatory";
const CONTACT_EMAIL = "support@financial-observatory.app";
const GOVERNING_LAW = "India";

export function TermsOfService() {
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
          Terms of Service
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2.5rem" }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using {APP_NAME} (the "Service"), you agree to be bound by these Terms of Service
            ("Terms"). If you do not agree, do not use the Service.
          </p>
          <p>
            These Terms apply to all users of the Service, including users of the web application, Progressive Web
            App (PWA), and any mobile application wrappers.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            {APP_NAME} is a personal finance tracking application that allows you to:
          </p>
          <ul>
            <li>Record and categorize income and expense transactions</li>
            <li>Set and monitor budget limits per spending category</li>
            <li>Plan and track savings goals</li>
            <li>Import bank statements (PDF) for automated categorization</li>
            <li>Use AI-powered features including receipt scanning, natural language transaction entry, and spending insights</li>
          </ul>
          <p>
            <strong>Important:</strong> {APP_NAME} is a personal budgeting tool, NOT a licensed financial advisor,
            bank, or investment platform. Nothing in the app constitutes financial, investment, tax, or legal advice.
          </p>
        </Section>

        <Section title="3. User Accounts">
          <ul>
            <li>You must be at least 13 years old (16 in the EU) to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must provide accurate information when creating your account.</li>
            <li>Notify us immediately at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-indigo)" }}>
                {CONTACT_EMAIL}
              </a>{" "}
              if you suspect unauthorized use of your account.
            </li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree NOT to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
            <li>Attempt to gain unauthorized access to our systems or other users' data</li>
            <li>Use automated scripts, bots, or scrapers against the Service</li>
            <li>Reverse-engineer, decompile, or disassemble any portion of the Service</li>
            <li>Upload malicious content (viruses, malware, destructive code)</li>
            <li>Attempt to circumvent rate limits or security measures</li>
            <li>Use AI features to generate fraudulent or misleading financial records</li>
            <li>Share your account with others or impersonate another person</li>
          </ul>
        </Section>

        <Section title="5. Financial Data Disclaimer">
          <p>
            <strong>No Financial Advice:</strong> All spending predictions, AI insights, budget suggestions, and
            savings projections provided by {APP_NAME} are for informational and organizational purposes only.
            They are not professional financial advice. Always consult a qualified financial advisor for important
            financial decisions.
          </p>
          <p>
            <strong>No Guarantee of Accuracy:</strong> AI-powered features (receipt parsing, statement import,
            spending insights) may produce errors. You are responsible for verifying all transaction data before
            making financial decisions based on it.
          </p>
          <p>
            <strong>No Bank Integration:</strong> {APP_NAME} does not connect to your bank accounts. All transaction
            data is manually entered or uploaded by you.
          </p>
        </Section>

        <Section title="6. AI Features">
          <p>
            Our AI features are powered by Google Gemini AI. By using AI features, you acknowledge that:
          </p>
          <ul>
            <li>Relevant data (text, images) is sent to Google's servers for processing</li>
            <li>AI outputs may occasionally be inaccurate — always review before saving</li>
            <li>AI-generated transactions require your explicit confirmation before being saved</li>
            <li>Per-user rate limits apply to prevent abuse of AI features</li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            {APP_NAME}, its design system, codebase, AI prompts, and all associated content are the intellectual
            property of the developers of Financial Observatory. All rights reserved.
          </p>
          <p>
            Your personal financial data (transactions, budgets, goals) remains yours. We claim no ownership over
            data you input into the Service.
          </p>
        </Section>

        <Section title="8. Privacy">
          <p>
            Your use of the Service is also governed by our{" "}
            <Link to="/privacy" style={{ color: "var(--accent-indigo)" }}>
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="9. Service Availability">
          <ul>
            <li>
              We strive for high availability but do not guarantee uninterrupted access. Scheduled maintenance and
              unexpected outages may occur.
            </li>
            <li>
              AI features (Ask Your Money, receipt scanning, etc.) depend on third-party services (Google Gemini)
              and may be temporarily unavailable.
            </li>
            <li>
              We reserve the right to modify, suspend, or discontinue any part of the Service with reasonable notice.
            </li>
          </ul>
        </Section>

        <Section title="10. Termination">
          <p>
            You may delete your account at any time from Settings → Account → Delete Account. This permanently
            removes all your data from our systems within 30 days.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if you violate these Terms, engage in abusive
            behavior, or for any other reason we deem appropriate with reasonable notice.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, {APP_NAME} and its developers shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, including but not limited to
            loss of data, financial loss, or business interruption, arising from your use of or inability to use the
            Service.
          </p>
          <p>
            Our total liability for any claim arising from these Terms or the Service shall not exceed the amount you
            paid us in the 12 months preceding the claim (which may be zero for free-tier users).
          </p>
        </Section>

        <Section title="12. Indemnification">
          <p>
            You agree to indemnify and hold harmless {APP_NAME} and its developers from any claims, damages, or
            expenses (including reasonable attorneys' fees) arising from your use of the Service, violation of these
            Terms, or infringement of any rights of a third party.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of {GOVERNING_LAW}, without regard
            to conflict of law principles. Any disputes shall be resolved in the competent courts of {GOVERNING_LAW}.
          </p>
        </Section>

        <Section title="14. Changes to Terms">
          <p>
            We may update these Terms from time to time. Material changes will be communicated via in-app notice or
            email at least 14 days before they take effect. Continued use of the Service after the effective date
            constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="15. Contact">
          <p>
            Questions about these Terms? Contact us at:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-indigo)" }}>
              {CONTACT_EMAIL}
            </a>
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
          <Link to="/privacy" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none" }}>
            Privacy Policy →
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
