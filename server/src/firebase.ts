import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App;

function initFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Option 1: Full service account JSON provided in environment variable (Render secret)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || "financial-observatory-1b20e",
      });
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err);
    }
  }

  // Option 2: Individual credential fields provided in environment variables
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "financial-observatory-1b20e",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID || "financial-observatory-1b20e",
    });
  }

  // Option 3: Fallback to application default credentials or projectId
  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "financial-observatory-1b20e",
  });
}

adminApp = initFirebaseAdmin();

export { adminApp, getAuth, getFirestore };
