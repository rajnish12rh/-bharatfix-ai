import path from "node:path";
import {
  REPORT_STATUSES,
  ReportModel,
  SEVERITY_LEVELS,
  type ReportDocument,
  type ReportStatus,
  type SeverityLevel,
} from "../models/Report";
import { HttpError } from "../utils/httpError";
import { generateReportId } from "../utils/reportId";

export type PublicReport = {
  reportId: string;
  issueType: string;
  category: string;
  confidence: number;
  isDemoAnalysis: boolean;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationDescription: string;
  imageUrl: string;
  imagePath: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ReportFilters = {
  severity?: unknown;
  status?: unknown;
};

export type DashboardStats = {
  total: number;
  bySeverity: Record<SeverityLevel, number>;
  byStatus: Record<ReportStatus, number>;
  openHighPriority: number;
  last7Days: number;
};

type CreateReportInput = {
  issueType: unknown;
  category: unknown;
  confidence: unknown;
  isDemoAnalysis: unknown;
  severity: unknown;
  latitude: unknown;
  longitude: unknown;
  locationDescription: unknown;
  file?: Express.Multer.File;
};

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `${field} is required.`);
  }

  return value.trim();
}

function requiredNumber(value: unknown, field: string): number {
  if (value === undefined || value === null || value === "") {
    throw new HttpError(400, `${field} is required.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new HttpError(400, `${field} must be a valid number.`);
  }

  return parsed;
}

function parseSeverity(value: unknown): SeverityLevel {
  const severity = requiredString(value, "severity");
  if (!SEVERITY_LEVELS.includes(severity as SeverityLevel)) {
    throw new HttpError(400, "severity must be Low, Medium, or High.");
  }

  return severity as SeverityLevel;
}

function parseStatus(value: unknown): ReportStatus {
  const status = requiredString(value, "status");
  if (!REPORT_STATUSES.includes(status as ReportStatus)) {
    throw new HttpError(400, "status must be Submitted, In Review, or Resolved.");
  }

  return status as ReportStatus;
}

function optionalFilter<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string
): T | undefined {
  if (value === undefined || value === "" || value === "All") {
    return undefined;
  }

  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new HttpError(400, `Invalid ${field} filter.`);
  }

  return value as T;
}

function toPublicReport(report: ReportDocument): PublicReport {
  return {
    reportId: report.reportId,
    issueType: report.issueType,
    category: report.category,
    confidence: report.confidence,
    isDemoAnalysis: report.isDemoAnalysis ?? true,
    severity: report.severity,
    latitude: report.latitude,
    longitude: report.longitude,
    locationDescription: report.locationDescription ?? "",
    imageUrl: report.imageUrl,
    imagePath: report.imagePath,
    status: (report.status ?? "Submitted") as ReportStatus,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

async function createUniqueReportId(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const reportId = generateReportId();
    const exists = await ReportModel.exists({ reportId });
    if (!exists) {
      return reportId;
    }
  }

  throw new HttpError(500, "Could not generate a unique report ID.");
}

export async function createReport(input: CreateReportInput): Promise<PublicReport> {
  if (!input.file) {
    throw new HttpError(400, "An image is required.");
  }

  const issueType = requiredString(input.issueType, "issueType");
  const category = requiredString(input.category, "category");
  const confidence = requiredNumber(input.confidence, "confidence");
  const latitude = requiredNumber(input.latitude, "latitude");
  const longitude = requiredNumber(input.longitude, "longitude");
  const severity = parseSeverity(input.severity);
  const isDemoAnalysis = input.isDemoAnalysis !== "false";
  const locationDescription =
    typeof input.locationDescription === "string" ? input.locationDescription.trim() : "";

  if (confidence < 0 || confidence > 100) {
    throw new HttpError(400, "confidence must be between 0 and 100.");
  }

  if (latitude < -90 || latitude > 90) {
    throw new HttpError(400, "latitude must be between -90 and 90.");
  }

  if (longitude < -180 || longitude > 180) {
    throw new HttpError(400, "longitude must be between -180 and 180.");
  }

  const reportId = await createUniqueReportId();
  const imageUrl = `/uploads/${input.file.filename}`;
  const imagePath = path.posix.join("uploads", input.file.filename);

  const report = await ReportModel.create({
    reportId,
    issueType,
    category,
    confidence,
    isDemoAnalysis,
    severity,
    latitude,
    longitude,
    locationDescription,
    imageUrl,
    imagePath,
    status: "Submitted",
  });

  return toPublicReport(report);
}

export async function listReports(filters: ReportFilters = {}): Promise<PublicReport[]> {
  const severity = optionalFilter(filters.severity, SEVERITY_LEVELS, "severity");
  const status = optionalFilter(filters.status, REPORT_STATUSES, "status");

  const query: Record<string, string> = {};
  if (severity) {
    query.severity = severity;
  }
  if (status) {
    query.status = status;
  }

  const reports = await ReportModel.find(query).sort({ createdAt: -1 }).exec();
  return reports.map((report) => toPublicReport(report));
}

export async function getReportById(reportId: string): Promise<PublicReport> {
  const report = await ReportModel.findOne({ reportId: reportId.trim().toUpperCase() }).exec();

  if (!report) {
    throw new HttpError(404, "Report not found.");
  }

  return toPublicReport(report);
}

export async function updateReportStatus(
  reportId: string,
  statusInput: unknown
): Promise<PublicReport> {
  const status = parseStatus(statusInput);
  const report = await ReportModel.findOneAndUpdate(
    { reportId: reportId.trim().toUpperCase() },
    { status },
    { new: true, runValidators: true }
  ).exec();

  if (!report) {
    throw new HttpError(404, "Report not found.");
  }

  return toPublicReport(report);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, severityGroups, statusGroups, openHighPriority, last7Days] = await Promise.all([
    ReportModel.countDocuments().exec(),
    ReportModel.aggregate<{ _id: SeverityLevel; count: number }>([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]).exec(),
    ReportModel.aggregate<{ _id: ReportStatus; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).exec(),
    ReportModel.countDocuments({ severity: "High", status: { $ne: "Resolved" } }).exec(),
    ReportModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } }).exec(),
  ]);

  const bySeverity: Record<SeverityLevel, number> = { Low: 0, Medium: 0, High: 0 };
  for (const group of severityGroups) {
    if (group._id in bySeverity) {
      bySeverity[group._id] = group.count;
    }
  }

  const byStatus: Record<ReportStatus, number> = {
    Submitted: 0,
    "In Review": 0,
    Resolved: 0,
  };
  for (const group of statusGroups) {
    if (group._id in byStatus) {
      byStatus[group._id] = group.count;
    }
  }

  return { total, bySeverity, byStatus, openHighPriority, last7Days };
}
