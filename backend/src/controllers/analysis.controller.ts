import type { Request, Response } from "express";
import type { ApiResponse } from "../types";
import { analyzeImage, type AnalysisResult } from "../services/analysis.service";

export async function postAnalysis(
  req: Request,
  res: Response<ApiResponse<AnalysisResult>>
): Promise<void> {
  const result = await analyzeImage(req.file);

  res.status(200).json({
    success: true,
    message: result.isDemo ? "Demo analysis completed" : "AI analysis completed",
    data: result,
  });
}
