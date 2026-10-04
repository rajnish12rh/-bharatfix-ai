import type { Request, Response } from "express";
import type { ApiResponse } from "../types";

export function getHealth(_req: Request, res: Response<ApiResponse>): void {
  res.status(200).json({
    success: true,
    message: "BharatFix AI API is running",
  });
}
