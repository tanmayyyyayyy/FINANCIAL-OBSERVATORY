import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App;

/**
 * Normalize a Firebase private key as it arrives from a Render environment variable.
 *
 * Render (and other PaaS platforms) may deliver the value with:
 *   1. Literal two-character sequences  \  n  instead of real newlines
 *   2. Surrounding double or single quotes added by the shell or UI
 *   3. Windows-style  \r\n  line endings
 *
 * This function handles all three without logging any portion of the key value.
 */
export function normalizePrivateKey(raw: string): string {
  // Step 1: Strip one layer of surrounding double or single quotes if present.
  //         Render's secret UI occasionally wraps values in quotes.
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Step 2: Unescape literal \r and \n sequences (two chars) into real control
  //         characters. Order matters: \r must be converted before the CRLF pass.
  key = key.replace(/\\r/g, "\r").replace(/\\n/g, "\n");

  // Step 3: Normalise Windows-style CRLF to LF so OpenSSL is happy.
  key = key.replace(/\r\n/g, "\n");

  // Step 4: Remove any stray isolated \r characters (e.g. from unusual encodings).
  key = key.replace(/\r/g, "\n");

  return key;
}

function initFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Option 1: Full service account JSON provided as a single Render secret.
  // The JSON blob already contains a properly escaped private_key field.
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as {
        project_id?: string;
        private_key?: string;
      };
      // Normalise the embedded private key in case the JSON was hand-edited.
      if (typeof serviceAccount.private_key === "string") {
        serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);
      }
      return initializeApp({
        credential: cert(serviceAccount as Parameters<typeof cert>[0]),
        projectId: serviceAccount.project_id ?? process.env.FIREBASE_PROJECT_ID ?? "financial-observatory-1b20e",
      });
    } catch (err) {
      // Log the error object only — never the credential value.
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", (err as Error).message);
    }
  }

  // Option 2: Individual credential fields.
  // FIREBASE_PRIVATE_KEY arrives from Render with literal \n sequences
  // and possibly surrounding quotes — normalizePrivateKey() handles both.
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    // Structural sanity check — logged only as a boolean, never the key value.
    const looksLikePem =
      privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
      privateKey.includes("-----END PRIVATE KEY-----");
    if (!looksLikePem) {
      console.error(
        "FIREBASE_PRIVATE_KEY does not look like a valid PEM block after normalisation. " +
        "Ensure the Render secret value is the raw private key string from the service-account JSON."
      );
    }

    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID ?? "financial-observatory-1b20e",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID ?? "financial-observatory-1b20e",
    });
  }

  // Option 3: Application Default Credentials (works in GCP/Cloud Run, not on Render).
  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT ?? "financial-observatory-1b20e",
  });
}

adminApp = initFirebaseAdmin();

export { adminApp, getAuth, getFirestore };
