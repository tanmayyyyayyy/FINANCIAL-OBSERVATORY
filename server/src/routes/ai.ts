import { Router, type Response } from "express";
import {
  authMiddleware,
  aiOptInMiddleware,
  aiRateLimitMiddleware,
  type AuthenticatedRequest,
} from "../ai/security";
import {
  handleParseTransaction,
  handleScanReceipt,
  handleParseGoal,
  handleWeeklyInsight,
  handleAskYourMoney,
} from "../ai/features";

const router = Router();

// Apply auth, AI opt-in, and rate limit to all AI endpoints
router.use(authMiddleware);
router.use(aiOptInMiddleware);
router.use(aiRateLimitMiddleware);

function handleAiError(err: unknown, res: Response): void {
  const error = err as { code?: string; message?: string; reason?: string };
  if (error.code === "INVALID_INPUT") {
    res.status(400).json({
      error: "InvalidArgument",
      message: error.message || "Check the information and try again.",
      reason: "INVALID_INPUT",
    });
    return;
  }
  if (error.message === "INVALID_AI_OUTPUT") {
    res.status(502).json({
      error: "FailedPrecondition",
      message: "We couldn't safely understand that. Please try again.",
      reason: "INVALID_AI_OUTPUT",
    });
    return;
  }
  if (error.message === "AI_UNAVAILABLE") {
    res.status(503).json({
      error: "Unavailable",
      message: "AI couldn't respond right now. Try again.",
      reason: "AI_UNAVAILABLE",
    });
    return;
  }
  res.status(500).json({
    error: "InternalError",
    message: "AI couldn't respond right now. Try again.",
    reason: "AI_UNAVAILABLE",
  });
}

// 1. Quick Add natural language transaction parsing
router.post("/parse-transaction", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await handleParseTransaction(req.uid!, req.body);
    res.json(result);
  } catch (err) {
    handleAiError(err, res);
  }
});

// 2. Receipt image scanning
router.post("/scan-receipt", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await handleScanReceipt(req.uid!, req.body);
    res.json(result);
  } catch (err) {
    handleAiError(err, res);
  }
});

// 3. Goal planner text parsing
router.post("/parse-goal", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await handleParseGoal(req.uid!, req.body);
    res.json(result);
  } catch (err) {
    handleAiError(err, res);
  }
});

// 4. Weekly deterministic insight generation
router.post("/weekly-insight", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await handleWeeklyInsight(req.uid!);
    res.json(result);
  } catch (err) {
    handleAiError(err, res);
  }
});

// 5. Ask Your Money assistant chat with tool execution
router.post("/ask", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await handleAskYourMoney(req.uid!, req.body);
    res.json(result);
  } catch (err) {
    handleAiError(err, res);
  }
});

export { router as aiRouter };
