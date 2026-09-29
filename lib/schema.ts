import { Schema, Type } from "@google/genai";
import { SEVERITIES } from "@/config/app.config";

export const roastResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    roast: {
      type: Type.STRING,
      description: "Witty Hinglish critique of the code with emojis",
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          line: { type: Type.INTEGER },
          severity: {
            type: Type.STRING,
            enum: [...SEVERITIES],
          },
          title: { type: Type.STRING },
          codeSnippet: { type: Type.STRING },
          diagnosis: { type: Type.STRING },
          expected: { type: Type.STRING },
        },
        required: [
          "line",
          "severity",
          "title",
          "codeSnippet",
          "diagnosis",
          "expected",
        ],
      },
    },
    correctedCode: {
      type: Type.STRING,
      description: "Fixed working program without markdown backticks",
    },
    takeaway: {
      type: Type.STRING,
      description: "Key architectural or practical takeaway advice",
    },
  },
  required: ["roast", "issues", "correctedCode", "takeaway"],
};
