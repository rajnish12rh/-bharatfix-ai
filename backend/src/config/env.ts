import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(__dirname, "../../.env");

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function applyIfMissing(key: string, value: string): void {
  const current = process.env[key];
  if (current === undefined || current.trim() === "") {
    process.env[key] = value;
  }
}

function loadEnvFile(): void {
  dotenv.config({ path: envPath });

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs
    .readFileSync(envPath, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line || line.trim() === "" || line.trim().startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    const nextLine = lines[index + 1]?.trim() ?? "";

    if (!value && (nextLine.startsWith("mongodb://") || nextLine.startsWith("mongodb+srv://"))) {
      value = nextLine;
    }

    value = stripQuotes(value);
    if (key && value) {
      applyIfMissing(key, value);
    }
  }
}

loadEnvFile();
