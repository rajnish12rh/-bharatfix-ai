import type { Request, Response } from "express";
import { removeUploadedFile } from "../middleware/upload";
import type { ApiResponse } from "../types";
import type { DashboardStats, PublicReport } from "../services/report.service";
import {
  createReport,
  getDashboardStats,
  getReportById,
  listReports,
  updateReportStatus,
} from "../services/report.service";
import { HttpError } from "../utils/httpError";

function reportIdParam(req: Request): string {
  const value = Array.isArray(req.params.reportId) ? req.params.reportId[0] : req.params.reportId;
  if (!value) {
    throw new HttpError(400, "reportId is required.");
  }

  return value;
}

export async function postReport(
  req: Request,
  res: Response<ApiResponse<PublicReport>>
): Promise<void> {
  try {
    const report = await createReport({
      issueType: req.body.issueType,
      category: req.body.category,
      confidence: req.body.confidence,
      isDemoAnalysis: req.body.isDemoAnalysis,
      severity: req.body.severity,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      locationDescription: req.body.locationDescription,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    removeUploadedFile(req.file);
    throw error;
  }
}

export async function getReports(
  req: Request,
  res: Response<ApiResponse<PublicReport[]>>
): Promise<void> {
  const reports = await listReports({
    severity: req.query.severity,
    status: req.query.status,
  });

  res.status(200).json({
    success: true,
    message: "Reports retrieved successfully",
    data: reports,
  });
}

export async function getReport(
  req: Request,
  res: Response<ApiResponse<PublicReport>>
): Promise<void> {
  const report = await getReportById(reportIdParam(req));

  res.status(200).json({
    success: true,
    message: "Report retrieved successfully",
    data: report,
  });
}

export async function patchReportStatus(
  req: Request,
  res: Response<ApiResponse<PublicReport>>
): Promise<void> {
  const report = await updateReportStatus(reportIdParam(req), req.body?.status);

  res.status(200).json({
    success: true,
    message: "Report status updated",
    data: report,
  });
}

export async function getStats(
  _req: Request,
  res: Response<ApiResponse<DashboardStats>>
): Promise<void> {
  const stats = await getDashboardStats();

  res.status(200).json({
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: stats,
  });
}
