import type { Request, Response, NextFunction } from "express";
import { getAuth, getFirestore } from "../firebase";
import { enforceAiRateLimit } from "./rateLimit";

export interface AuthenticatedRequest extends Request {
  uid?: string;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Please sign in to use this feature.",
    });
    return;
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token missing.",
    });
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Session expired or invalid. Please sign in again.",
    });
  }
}

export async function aiOptInMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const uid = req.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "Authentication required." });
    return;
  }

  try {
    const userDoc = await getFirestore().doc(`users/${uid}`).get();
    if (userDoc.get("aiEnabled") !== true) {
      res.status(403).json({
        error: "FailedPrecondition",
        message: "AI features are turned off. Enable them in Settings.",
        reason: "AI_FEATURES_DISABLED",
      });
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({
      error: "InternalError",
      message: "Unable to verify AI permissions.",
    });
  }
}

export async function aiRateLimitMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const uid = req.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "Authentication required." });
    return;
  }

  try {
    await enforceAiRateLimit(uid);
    next();
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string; reason?: string };
    if (error.code === "resource-exhausted" || error.reason === "AI_RATE_LIMIT_EXCEEDED") {
      res.status(429).json({
        error: "ResourceExhausted",
        message: "You've reached your AI limit for now. Try again later.",
        reason: "AI_RATE_LIMIT_EXCEEDED",
      });
      return;
    }
    res.status(500).json({
      error: "InternalError",
      message: "Unable to process AI rate limits.",
    });
  }
}
