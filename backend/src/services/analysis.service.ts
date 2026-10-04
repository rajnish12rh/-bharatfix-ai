import { SEVERITY_LEVELS, type SeverityLevel } from "../models/Report";
import { HttpError } from "../utils/httpError";

export type AnalysisResult = {
  detectedIssue: string;
  category: string;
  confidence: number;
  severity: SeverityLevel;
  isDemo: boolean;
  source: "demo" | "gemini";
};

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_TIMEOUT_MS = 30_000;

const CATEGORIES = [
  "Road Surface Damage",
  "Drainage & Waterlogging",
  "Streetlight & Electrical",
  "Garbage & Sanitation",
  "Footpath & Pedestrian Safety",
  "Bridge & Structural Damage",
  "Water Supply Leakage",
  "Other Public Infrastructure",
];

const PROMPT = `You are an assistant that inspects citizen photos of public infrastructure in Indian cities.
Look at the image and respond ONLY with a JSON object of this exact shape:
{
  "isInfrastructureIssue": boolean,
  "detectedIssue": string,
  "category": string,
  "confidence": number,
  "severity": "Low" | "Medium" | "High"
}
Rules:
- "detectedIssue" is a short name such as "Pothole", "Road Crack", "Open Manhole", "Broken Streetlight", "Garbage Dump", "Waterlogging".
- "category" must be one of: ${CATEGORIES.join(", ")}.
- "confidence" is your confidence from 0 to 100.
- "severity": High = immediate danger to people or vehicles, Medium = noticeable damage that needs scheduled repair, Low = minor wear.
- If the photo does not show a public infrastructure problem, set "isInfrastructureIssue" to false.`;

function demoAnalysis(): AnalysisResult {
  return {
    detectedIssue: "Pothole",
    category: "Road Surface Damage",
    confidence: 94,
    severity: "High",
    isDemo: true,
    source: "demo",
  };
}

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
};

type ParsedModelOutput = {
  isInfrastructureIssue?: unknown;
  detectedIssue?: unknown;
  category?: unknown;
  confidence?: unknown;
  severity?: unknown;
};

function normalizeModelOutput(output: ParsedModelOutput): AnalysisResult {
  if (output.isInfrastructureIssue === false) {
    throw new HttpError(
      422,
      "No public infrastructure issue was detected in this photo. Please upload a clearer photo of the problem."
    );
  }

  const detectedIssue =
    typeof output.detectedIssue === "string" && output.detectedIssue.trim()
      ? output.detectedIssue.trim()
      : "Infrastructure Issue";

  const category =
    typeof output.category === "string" && CATEGORIES.includes(output.category)
      ? output.category
      : "Other Public Infrastructure";

  const rawConfidence = Number(output.confidence);
  const confidence = Number.isFinite(rawConfidence)
    ? Math.round(Math.min(100, Math.max(0, rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)))
    : 50;

  const severity = SEVERITY_LEVELS.includes(output.severity as SeverityLevel)
    ? (output.severity as SeverityLevel)
    : "Medium";

  return { detectedIssue, category, confidence, severity, isDemo: false, source: "gemini" };
}

async function geminiAnalysis(file: Express.Multer.File, apiKey: string): Promise<AnalysisResult> {
  const model = process.env["GEMINI_MODEL"]?.trim() || DEFAULT_GEMINI_MODEL;
  const mimeType = file.mimetype === "image/jpg" ? "image/jpeg" : file.mimetype;

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: file.buffer.toString("base64") } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      }
    );
  } catch (error) {
    console.error("Gemini request failed:", error);
    throw new HttpError(502, "AI analysis service is unreachable. Please try again.");
  }

  const payload = (await response.json().catch(() => ({}))) as GeminiResponse;

  if (!response.ok) {
    console.error("Gemini error:", response.status, payload.error?.message);
    throw new HttpError(502, "AI analysis failed. Please try again.");
  }

  const text = payload.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
  if (!text) {
    throw new HttpError(502, "AI analysis returned an empty result. Please try again.");
  }

  let parsed: ParsedModelOutput;
  try {
    parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, "")) as ParsedModelOutput;
  } catch {
    throw new HttpError(502, "AI analysis returned an unreadable result. Please try again.");
  }

  return normalizeModelOutput(parsed);
}

export async function analyzeImage(file: Express.Multer.File | undefined): Promise<AnalysisResult> {
  if (!file) {
    throw new HttpError(400, "An image is required.");
  }

  const apiKey = process.env["GEMINI_API_KEY"]?.trim();
  if (!apiKey) {
    return demoAnalysis();
  }

  return geminiAnalysis(file, apiKey);
}
