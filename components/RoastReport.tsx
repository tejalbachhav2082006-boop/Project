"use client";

import React from "react";
import { LanguageId, ReportState, RoastLevel, RoastResult } from "@/types/roast";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHeader } from "./SectionHeader";
import { IssueCard } from "./IssueCard";
import { FixedCode } from "./FixedCode";

interface RoastReportProps {
  state: ReportState;
  roastLevel: RoastLevel;
  language: LanguageId;
  result: RoastResult | null;
  errorMsg: string | null;
  onRetry: () => void;
  onApplyFix: (code: string) => void;
}

export function RoastReport({
  state,
  roastLevel,
  language,
  result,
  errorMsg,
  onRetry,
  onApplyFix,
}: RoastReportProps) {
  return (
    <section className="flex flex-col flex-1 w-full lg:w-[46%] min-h-[450px] bg-panel border-t lg:border-t-0 lg:border-l border-subtle">
      {/* 40px Header Strip */}
      <div className="h-10 px-4 border-b border-subtle bg-zinc-50 flex items-center justify-between font-mono text-xs shrink-0">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
          AUDIT // REPORT
        </span>
        <span className="font-bold text-frame uppercase tracking-wider">
          Roast Report
        </span>
        <span className="w-16" />
      </div>

      {/* Report Body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {state === "empty" && <EmptyState />}

        {state === "loading" && <LoadingState />}

        {state === "error" && (
          <ErrorState error={errorMsg} onRetry={onRetry} />
        )}

        {state === "results" && result && (
          <div className="p-6 space-y-6">
            {/* Section 1: Roast */}
            <div>
              <SectionHeader number={1} title="ROAST">
                <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  STYLE: {roastLevel}
                </span>
              </SectionHeader>
              <blockquote className="p-4 bg-zinc-50 border-l-4 border-accent border-y border-r border-subtle font-mono text-xs md:text-sm text-zinc-900 leading-relaxed italic">
                &ldquo;{result.roast}&rdquo;
              </blockquote>
            </div>

            {/* Section 2: What's Wrong */}
            <div>
              <SectionHeader number={2} title="WHAT'S WRONG">
                <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {result.issues.length}{" "}
                  {result.issues.length === 1 ? "ISSUE" : "ISSUES"}
                </span>
              </SectionHeader>

              {result.issues.length === 0 ? (
                <div className="p-4 border border-emerald-200 bg-emerald-50 text-emerald-800 font-mono text-xs font-bold text-center">
                  No issues found. Suspiciously clean.
                </div>
              ) : (
                <div className="space-y-3">
                  {result.issues.map((issue, idx) => (
                    <IssueCard key={idx} index={idx + 1} issue={issue} />
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Fix (only if correctedCode is non-empty) */}
            {result.correctedCode && result.correctedCode.trim().length > 0 && (
              <FixedCode
                sectionNumber={3}
                language={language}
                code={result.correctedCode}
                onApply={onApplyFix}
              />
            )}

            {/* Section 4/3: Takeaway (only if takeaway is non-empty) */}
            {result.takeaway && result.takeaway.trim().length > 0 && (
              <div>
                <SectionHeader
                  number={
                    result.correctedCode &&
                    result.correctedCode.trim().length > 0
                      ? 4
                      : 3
                  }
                  title="TAKEAWAY"
                />
                <div className="p-4 bg-zinc-50 border border-subtle font-mono text-xs text-zinc-800 leading-relaxed">
                  {result.takeaway}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
