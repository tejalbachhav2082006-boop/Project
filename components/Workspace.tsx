"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DEFAULTS, SAMPLE } from "@/config/app.config";
import { requestRoast } from "@/lib/api";
import { LanguageId, ReportState, RoastLevel, RoastResult } from "@/types/roast";
import { TopBar } from "./TopBar";
import { RoastControls } from "./RoastControls";
import { ErrorMessageInput } from "./ErrorMessageInput";
import { CodeEditor } from "./CodeEditor";
import { RoastReport } from "./RoastReport";
import { StatusBar } from "./StatusBar";

export function Workspace() {
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(DEFAULTS.roastLevel);
  const [language, setLanguage] = useState<LanguageId>(DEFAULTS.language);
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDrawerOpen, setErrorDrawerOpen] = useState<boolean>(false);
  const [reportState, setReportState] = useState<ReportState>("empty");
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [roastedCode, setRoastedCode] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  const isRoasting = reportState === "loading";

  const handleRoast = useCallback(async () => {
    if (isRoasting) return;

    if (!code || code.trim().length === 0) {
      setApiError("No code provided. I can't roast the void.");
      setReportState("error");
      return;
    }

    setReportState("loading");
    setApiError(null);

    try {
      const result = await requestRoast({
        language,
        code,
        roastLevel,
        errorMessage: errorMessage.trim() || undefined,
      });
      setRoastResult(result);
      setRoastedCode(code);
      setReportState("results");
    } catch (err: any) {
      setApiError(err?.message || "An unknown error occurred.");
      setReportState("error");
    }
  }, [code, errorMessage, isRoasting, language, roastLevel]);

  const handleLoadSample = () => {
    setLanguage(SAMPLE.language);
    setCode(SAMPLE.code);
  };

  const handleApplyFix = (fixedCode: string) => {
    setCode(fixedCode);
  };

  const handleRetry = () => {
    handleRoast();
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter roasts from anywhere on the page
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRoast();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRoast]);

  // Highlight error line only when current code matches exactly what was roasted
  const errorLine =
    reportState === "results" && code === roastedCode
      ? roastResult?.issues?.[0]?.line
      : undefined;

  return (
    <main className="w-full max-w-[1360px] mx-auto my-2 sm:my-4 md:my-6 bg-panel border-2 border-frame shadow-[4px_4px_0px_0px_rgba(17,17,17,0.12)] flex flex-col overflow-hidden">
      {/* Top Bar with Controls */}
      <TopBar>
        <RoastControls
          roastLevel={roastLevel}
          onRoastLevelChange={setRoastLevel}
          language={language}
          onLanguageChange={setLanguage}
          onRoast={handleRoast}
          isRoasting={isRoasting}
          errorDrawerOpen={errorDrawerOpen}
          onToggleErrorDrawer={() => setErrorDrawerOpen((prev) => !prev)}
        />
      </TopBar>

      {/* Optional Error Traceback Input Drawer */}
      {errorDrawerOpen && (
        <ErrorMessageInput
          value={errorMessage}
          onChange={setErrorMessage}
          onClose={() => setErrorDrawerOpen(false)}
        />
      )}

      {/* Main Split Body: Code Editor (left) + Roast Report (right) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-[500px]">
        <CodeEditor
          code={code}
          onChange={setCode}
          language={language}
          errorLine={errorLine}
          onLoadSample={handleLoadSample}
        />
        <RoastReport
          state={reportState}
          roastLevel={roastLevel}
          language={language}
          result={roastResult}
          errorMsg={apiError}
          onRetry={handleRetry}
          onApplyFix={handleApplyFix}
        />
      </div>

      {/* Persistent Status Bar */}
      <StatusBar isRoasting={isRoasting} />
    </main>
  );
}
