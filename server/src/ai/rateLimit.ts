import { getFirestore } from "../firebase";

export const AI_RATE_LIMIT = Object.freeze({
  maxRequests: 20,
  windowMs: 60 * 60 * 1000,
  collection: "aiRateLimits",
});

export const LIMIT_MESSAGE = "You've reached your AI limit for now. Try again later.";

export async function enforceAiRateLimit(uid: string): Promise<void> {
  const now = Date.now();
  const firestore = getFirestore();
  const limitRef = firestore.collection(AI_RATE_LIMIT.collection).doc(uid);

  await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(limitRef);
    const startedAt = snapshot.get("windowStartedAt");
    const requestCount = snapshot.get("requestCount");
    const validWindow =
      typeof startedAt === "number" &&
      Number.isFinite(startedAt) &&
      now >= startedAt &&
      now - startedAt < AI_RATE_LIMIT.windowMs;

    if (!validWindow) {
      transaction.set(limitRef, { windowStartedAt: now, requestCount: 1 });
      return;
    }

    if (typeof requestCount !== "number" || !Number.isSafeInteger(requestCount) || requestCount < 0) {
      transaction.set(limitRef, { windowStartedAt: now, requestCount: 1 });
      return;
    }

    if (requestCount >= AI_RATE_LIMIT.maxRequests) {
      const err = new Error(LIMIT_MESSAGE) as Error & { code: string; reason: string };
      err.code = "resource-exhausted";
      err.reason = "AI_RATE_LIMIT_EXCEEDED";
      throw err;
    }

    transaction.set(limitRef, { windowStartedAt: startedAt, requestCount: requestCount + 1 });
  });
}
