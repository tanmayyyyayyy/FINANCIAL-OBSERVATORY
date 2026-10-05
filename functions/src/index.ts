import { getApps, initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";
export { askYourMoney, parseSavingsGoal, parseTransactionText, scanReceipt, generateWeeklyInsight } from "./ai/features";

if (getApps().length === 0) initializeApp();

setGlobalOptions({
  region: "asia-south1",
  maxInstances: 10,
});
