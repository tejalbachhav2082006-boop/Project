import { GoogleGenAI } from "@google/genai";
import { AI } from "@/config/app.config";
import { RoastRequest, RoastResult } from "@/types/roast";
import { buildUserPrompt, ROAST_SYSTEM_INSTRUCTION } from "@/lib/prompt";
import { roastResponseSchema } from "@/lib/schema";

function friendlyErrorMessage(status?: number, rawError?: any): string {
  const message = rawError?.message || String(rawError || "");
  switch (status) {
    case 400:
      return `Invalid request to Gemini API (400). Please check your code input or schema formatting. (${message})`;
    case 403:
      return "Access denied (403). Your GEMINI_API_KEY may be invalid or unauthorized. Check your key in .env.local.";
    case 404:
      return `Model not found (404). Ensure model "${AI.model}" in config/app.config.ts is supported by your API key.`;
    case 429:
      return "Rate limit exceeded (429). The Gemini API is currently receiving too many requests. Please wait a moment and try again.";
    case 503:
      return "Gemini service temporarily overloaded (503). The server could not handle the request after multiple attempts.";
    default:
      return `Gemini API error${status ? ` (${status})` : ""}: ${message || "An unexpected error occurred."}`;
  }
}

export async function analyzeCode(request: RoastRequest): Promise<RoastResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      "GEMINI_API_KEY is missing. Copy .env.example to .env.local, add your key, and restart the server."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildUserPrompt(request);

  let lastError: any = null;

  for (let attempt = 1; attempt <= AI.maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: AI.model,
        contents: prompt,
        config: {
          systemInstruction: ROAST_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: roastResponseSchema,
        },
      });

      const text = response.text;
      if (!text || text.trim().length === 0) {
        throw new Error("Received an empty response from Gemini.");
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (err: any) {
        throw new Error(`Failed to parse Gemini response as JSON: ${err.message}`);
      }

      return {
        roast: typeof parsed.roast === "string" ? parsed.roast : "",
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        correctedCode:
          typeof parsed.correctedCode === "string" ? parsed.correctedCode : "",
        takeaway: typeof parsed.takeaway === "string" ? parsed.takeaway : "",
      };
    } catch (err: any) {
      lastError = err;
      const status =
        err?.status ||
        err?.statusCode ||
        (typeof err?.message === "string" && err.message.includes("503")
          ? 503
          : undefined);

      if (status === 503 && attempt < AI.maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        continue;
      }

      throw new Error(friendlyErrorMessage(status, err));
    }
  }

  throw new Error(friendlyErrorMessage(503, lastError));
}
