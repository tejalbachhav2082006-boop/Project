import { NextRequest, NextResponse } from "next/server";
import { DEFAULTS, LANGUAGES, LIMITS, ROAST_LEVELS } from "@/config/app.config";
import { analyzeCode } from "@/lib/gemini";
import { LanguageId, RoastLevel } from "@/types/roast";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const code = typeof body?.code === "string" ? body.code : "";
  const errorMessage =
    typeof body?.errorMessage === "string" ? body.errorMessage.trim() : "";

  // 1. Validate empty code
  if (!code || code.trim().length === 0) {
    return NextResponse.json({ error: "No code provided." }, { status: 400 });
  }

  // 2. Validate maxCodeLength
  if (code.length > LIMITS.maxCodeLength) {
    return NextResponse.json(
      {
        error: `Code exceeds maximum allowed length of ${LIMITS.maxCodeLength.toLocaleString()} characters.`,
      },
      { status: 400 }
    );
  }

  // 3. Validate maxErrorMessageLength
  if (errorMessage.length > LIMITS.maxErrorMessageLength) {
    return NextResponse.json(
      {
        error: `Error message exceeds maximum allowed length of ${LIMITS.maxErrorMessageLength.toLocaleString()} characters.`,
      },
      { status: 400 }
    );
  }

  // 4. Validate or fallback language & roastLevel
  const validLanguage: LanguageId = LANGUAGES.some((l) => l.id === body?.language)
    ? body.language
    : DEFAULTS.language;

  const validRoastLevel: RoastLevel = ROAST_LEVELS.some(
    (r) => r.id === body?.roastLevel
  )
    ? body.roastLevel
    : DEFAULTS.roastLevel;

  try {
    const result = await analyzeCode({
      language: validLanguage,
      code,
      roastLevel: validRoastLevel,
      errorMessage: errorMessage || undefined,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Roast API error:", error);
    const message =
      error?.message || "An unexpected error occurred during analysis.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
