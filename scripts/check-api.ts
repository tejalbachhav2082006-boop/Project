import { analyzeCode } from "../lib/gemini";
import { AI, SAMPLE } from "../config/app.config";

async function main() {
  console.log("--------------------------------------------------");
  console.log(`[Code Roaster] Testing Gemini API connection`);
  console.log(`Model: ${AI.model} (${AI.modelLabel})`);
  console.log("--------------------------------------------------");

  try {
    const result = await analyzeCode({
      language: SAMPLE.language,
      code: SAMPLE.code,
      roastLevel: "sharp",
      errorMessage: "TypeError: unsupported operand type(s) for +=: 'int' and 'list' at line 7",
    });

    console.log("✅ Success! Received response from Gemini:");
    console.log("\n--- ROAST ---");
    console.log(result.roast);
    console.log(`\n--- ISSUES FOUND (${result.issues.length}) ---`);
    result.issues.forEach((issue, idx) => {
      console.log(`[${idx + 1}] Line ${issue.line} [${issue.severity}]: ${issue.title}`);
      console.log(`    Diagnosis: ${issue.diagnosis}`);
      console.log(`    Expected:  ${issue.expected}`);
    });
    console.log("\n--- CORRECTED CODE ---");
    console.log(result.correctedCode);
    console.log("\n--- TAKEAWAY ---");
    console.log(result.takeaway);
    console.log("\n--------------------------------------------------");
    console.log("API check passed successfully.");
  } catch (error: any) {
    console.error("❌ API check failed:");
    console.error(error?.message || error);
    process.exit(1);
  }
}

main();
