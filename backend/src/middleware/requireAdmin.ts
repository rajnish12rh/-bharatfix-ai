import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

function safeEqual(a: string, b: string): boolean {
  const left = crypto.createHash("sha256").update(a).digest();
  const right = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(left, right);
}

/**
 * Protects admin-only routes when ADMIN_KEY is configured.
 * Without ADMIN_KEY (local development), requests pass through.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const adminKey = process.env["ADMIN_KEY"]?.trim();
  if (!adminKey) {
    next();
    return;
  }

  const provided = req.header("x-admin-key")?.trim() ?? "";
  if (!provided || !safeEqual(provided, adminKey)) {
    next(new HttpError(401, "A valid admin key is required to update report status."));
    return;
  }

  next();
}
