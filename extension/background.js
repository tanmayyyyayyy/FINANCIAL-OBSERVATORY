// Financial Observatory Extension — Background Service Worker
// Minimal: no persistent state needed. Firestore writes happen directly from popup.
// This file is required by Manifest V3 when "background.service_worker" is declared.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
