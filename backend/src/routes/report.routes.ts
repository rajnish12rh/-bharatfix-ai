import { Router } from "express";
import {
  getReport,
  getReports,
  getStats,
  patchReportStatus,
  postReport,
} from "../controllers/report.controller";
import { requireAdmin } from "../middleware/requireAdmin";
import { uploadReportImage } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/reports", uploadReportImage, asyncHandler(postReport));
router.get("/reports", asyncHandler(getReports));
router.get("/reports/:reportId", asyncHandler(getReport));
router.patch("/reports/:reportId/status", requireAdmin, asyncHandler(patchReportStatus));
router.get("/dashboard/stats", asyncHandler(getStats));

export default router;
