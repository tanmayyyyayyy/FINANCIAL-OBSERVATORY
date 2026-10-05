import { getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall, type CallableOptions, type CallableRequest } from "firebase-functions/v2/https";
import { enforceAiRateLimit } from "./rateLimit";

export function requireAuthenticatedUid(request: CallableRequest<unknown>): string {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in to use this feature.");
  return uid;
}

async function requireAiEnabled(uid: string): Promise<void> {
  const preference = await getFirestore().doc(`users/${uid}`).get();
  if (preference.get("aiEnabled") !== true) {
    throw new HttpsError("failed-precondition", "AI features are turned off.", { reason: "AI_FEATURES_DISABLED" });
  }
}

// Define future AI endpoints through this wrapper so auth and the shared quota
// are enforced before endpoint-specific work begins. UID comes only from Auth.
export function onAiCall<Data = unknown, Result = unknown>(
  handler: (uid: string, data: Data) => Result | Promise<Result>,
  options: CallableOptions<Data> = {},
) {
  return onCall<Data, Promise<Result>>(options, async (request) => {
    const uid = requireAuthenticatedUid(request);
    try {
      await requireAiEnabled(uid);
      await enforceAiRateLimit(uid);
    } catch (cause) {
      if (cause instanceof HttpsError) throw cause;
      throw new HttpsError("internal", "AI couldn't respond right now. Try again.", { reason: "AI_UNAVAILABLE" });
    }
    try {
      return await handler(uid, request.data);
    } catch (cause) {
      if (cause instanceof HttpsError) throw cause;
      throw new HttpsError("unavailable", "AI couldn't respond right now. Try again.", { reason: "AI_UNAVAILABLE" });
    }
  });
}
