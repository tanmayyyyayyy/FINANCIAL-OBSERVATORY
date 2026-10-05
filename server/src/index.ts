import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars FIRST — before anything that reads process.env at import time.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Allowed frontend origins for CORS
const rawOrigin = process.env.FRONTEND_ORIGIN || process.env.CLIENT_ORIGIN;
const allowedOrigins = rawOrigin
  ? rawOrigin.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Payload limit for receipt uploads (image data)
app.use(express.json({ limit: "5mb" }));

// ── Health check — registered FIRST, before Firebase or AI routes ──────────
// This must always respond regardless of Firebase credential state so that
// Render's health checker (and x-render-routing) can reach the process.
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "financial-observatory-api" });
});

// ── AI routes — imported lazily after Express is configured ────────────────
// Firebase Admin is initialised inside firebase.ts at module-load time.
// Deferring this import to after app.listen() means the server is already
// bound to the port and /health is already responding before Firebase init
// runs. A Firebase credential error will be logged but will NOT crash the
// process or prevent /health from responding.
import("./routes/ai.js")
  .then(({ aiRouter }) => {
    app.use("/api/ai", aiRouter);
    console.log("AI routes registered.");
  })
  .catch((err: unknown) => {
    console.error(
      "Failed to load AI routes (Firebase credential issue likely):",
      err instanceof Error ? err.message : String(err)
    );
    // Register a fallback so /api/ai/* returns 503 instead of 404
    app.use("/api/ai", (_req, res) => {
      res.status(503).json({
        error: "ServiceUnavailable",
        message: "AI backend failed to initialise. Check server credentials.",
      });
    });
  });

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "NotFound", message: "Endpoint not found." });
});

// Generic error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "InternalError", message: "An unexpected server error occurred." });
});

// Bind the port FIRST — health endpoint responds immediately.
// AI route registration completes asynchronously after.
app.listen(PORT, () => {
  console.log(`Financial Observatory API running on port ${PORT}`);
});

export default app;
