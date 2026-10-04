import mongoose, { Schema } from "mongoose";

export const SEVERITY_LEVELS = ["Low", "Medium", "High"] as const;
export const REPORT_STATUSES = ["Submitted", "In Review", "Resolved"] as const;

export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

const reportSchema = new Schema(
  {
    reportId: { type: String, required: true, unique: true, index: true },
    issueType: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    isDemoAnalysis: { type: Boolean, default: true },
    severity: { type: String, enum: SEVERITY_LEVELS, required: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    locationDescription: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true },
    imagePath: { type: String, required: true },
    status: { type: String, enum: REPORT_STATUSES, default: "Submitted" },
  },
  { timestamps: true }
);

export type ReportDocument = mongoose.InferSchemaType<typeof reportSchema>;

export const ReportModel = mongoose.model("Report", reportSchema);
