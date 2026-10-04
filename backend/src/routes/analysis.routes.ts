import { Router } from "express";
import { postAnalysis } from "../controllers/analysis.controller";
import { uploadAnalysisImage } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/analyze", uploadAnalysisImage, asyncHandler(postAnalysis));

export default router;
