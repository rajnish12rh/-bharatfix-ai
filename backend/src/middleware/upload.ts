import fs from "node:fs";
import path from "node:path";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { HttpError } from "../utils/httpError";

export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void {
  const extension = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_TYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.has(extension)) {
    callback(null, true);
    return;
  }

  callback(new HttpError(400, "Please upload a JPG, JPEG, or PNG image."));
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOADS_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeExtension = ALLOWED_EXTENSIONS.has(extension) ? extension : ".jpg";
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}${safeExtension}`);
  },
});

export const uploadReportImage = multer({
  storage: diskStorage,
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: imageFileFilter,
}).single("image");

export const uploadAnalysisImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: imageFileFilter,
}).single("image");

export function removeUploadedFile(file: Express.Multer.File | undefined): void {
  if (file?.path) {
    fs.promises.unlink(file.path).catch(() => undefined);
  }
}
