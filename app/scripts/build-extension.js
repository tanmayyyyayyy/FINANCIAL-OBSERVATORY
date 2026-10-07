// Build script for Financial Observatory Chrome Extension
// Bundles only the necessary Firebase SDK modules locally to avoid MV3 CSP violations
// and generates extension/firebase-config.js from app/.env if available.

import { build } from "vite";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(appDir, "..");
const extensionDir = path.resolve(rootDir, "extension");

// Helper to parse .env file
function parseEnv(envPath) {
  const env = {};
  if (!fs.existsSync(envPath)) return env;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
      env[key] = val;
    }
  }
  return env;
}

// Ensure extension/firebase-config.js is created from app/.env
const appEnv = parseEnv(path.resolve(appDir, ".env"));
const configPath = path.resolve(extensionDir, "firebase-config.js");

if (!fs.existsSync(configPath) || appEnv.VITE_FIREBASE_API_KEY) {
  const configContent = `// Generated Firebase client configuration for Chrome Extension
// Generated automatically from app/.env via \`npm run build:extension\`
export const firebaseConfig = {
  apiKey: ${JSON.stringify(appEnv.VITE_FIREBASE_API_KEY || "")},
  authDomain: ${JSON.stringify(appEnv.VITE_FIREBASE_AUTH_DOMAIN || "financial-observatory-1b20e.firebaseapp.com")},
  projectId: ${JSON.stringify(appEnv.VITE_FIREBASE_PROJECT_ID || "financial-observatory-1b20e")},
  storageBucket: ${JSON.stringify(appEnv.VITE_FIREBASE_STORAGE_BUCKET || "financial-observatory-1b20e.firebasestorage.app")},
  messagingSenderId: ${JSON.stringify(appEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "")},
  appId: ${JSON.stringify(appEnv.VITE_FIREBASE_APP_ID || "")},
};

export const APP_URL = "https://smart-expense-tracker-1-2lsb.onrender.com";
`;
  fs.writeFileSync(configPath, configContent, "utf-8");
  console.log("Synchronized extension/firebase-config.js from app/.env");
}

console.log("Bundling Firebase SDK for Chrome Extension (Manifest V3)...");

await build({
  root: appDir,
  configFile: false,
  publicDir: false,
  build: {
    outDir: extensionDir,
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "extension-firebase-entry.js"),
      name: "FirebaseBundle",
      fileName: () => "firebase.js",
      formats: ["es"],
    },
    minify: true,
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("Firebase bundle created at extension/firebase.js");
