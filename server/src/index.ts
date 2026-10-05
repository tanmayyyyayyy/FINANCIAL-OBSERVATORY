import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars FIRST — before anything that reads process.env at import time.
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const HOST = "0.0.0.0"; // Bind all interfaces — required for Render

// ── Request tracer — logs METHOD + path only, never headers/body/auth ───────
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

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

// ── Health check — registered first, before Firebase or AI routes ───────────
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "financial-observatory-api" });
});

// ── AI routes — loaded synchronously via require() (CJS compatible) ─────────
// Using require() instead of dynamic import() avoids the CJS/ESM mismatch
// that occurred with module: NodeNext producing import() inside CJS output.
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { aiRouter } = require("./routes/ai") as { aiRouter: express.Router };
  app.use("/api/ai", aiRouter);
  console.log("[STARTUP] AI routes registered.");
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("[STARTUP] Failed to load AI routes:", msg);
  app.use("/api/ai", (_req, res) => {
    res.status(503).json({
      error: "ServiceUnavailable",
      message: "AI backend failed to initialise. Check server logs.",
    });
  });
}

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "NotFound", message: "Endpoint not found." });
});

// Generic error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "InternalError", message: "An unexpected server error occurred." });
});

// ── Bind to HOST:PORT ────────────────────────────────────────────────────────
app.listen(PORT, HOST, () => {
  console.log(`[STARTUP] SERVER_READY host=${HOST} port=${PORT}`);
  console.log(`[STARTUP] /health registered -> GET http://${HOST}:${PORT}/health`);
});

export default app;
