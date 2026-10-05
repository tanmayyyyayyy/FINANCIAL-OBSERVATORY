import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { aiRouter } from "./routes/ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Allowed frontend origins for CORS
// FRONTEND_ORIGIN env var (comma-separated) controls this in production.
// CLIENT_ORIGIN is accepted as a legacy alias.
const rawOrigin = process.env.FRONTEND_ORIGIN || process.env.CLIENT_ORIGIN;
const allowedOrigins = rawOrigin
  ? rawOrigin.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, server-to-server)
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

// Health check endpoint (Required by Render)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Mount AI routes
app.use("/api/ai", aiRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "NotFound", message: "Endpoint not found." });
});

// Generic error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "InternalError", message: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`Financial Observatory API running on port ${PORT}`);
});

export default app;
