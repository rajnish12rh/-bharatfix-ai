import { Router } from "express";
import analysisRoutes from "./analysis.routes";
import healthRoutes from "./health.routes";
import reportRoutes from "./report.routes";

const router = Router();

router.use(healthRoutes);
router.use(analysisRoutes);
router.use(reportRoutes);

export default router;
