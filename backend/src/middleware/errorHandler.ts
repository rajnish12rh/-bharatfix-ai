import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import type { ApiResponse } from "../types";
import { HttpError } from "../utils/httpError";

export function notFound(_req: Request, res: Response<ApiResponse>): void {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 10 MB or smaller."
        : err.message;
    res.status(400).json({
      success: false,
      message,
    });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
}
