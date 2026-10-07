// Build script for Financial Observatory Chrome Extension
// Bundles only the necessary Firebase SDK modules locally to avoid MV3 CSP violations.

import { build } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(appDir, "..");
const extensionDir = path.resolve(rootDir, "extension");

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
