import React from "react";
import { RoastIssue, Severity } from "@/types/roast";

interface IssueCardProps {
  index: number;
  issue: RoastIssue;
}

const severityConfig: Record<
  Severity,
  { badge: string; leftBorder: string }
> = {
  "FATAL BUG": {
    badge: "bg-red-50 text-accent border border-red-200",
    leftBorder: "border-l-accent",
  },
  "CODE SMELL": {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    leftBorder: "border-l-amber-500",
  },
  OPTIMIZATION: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    leftBorder: "border-l-emerald-600",
  },
};

export function IssueCard({ index, issue }: IssueCardProps) {
  const paddedIndex = String(index).padStart(2, "0");
  const config =
    severityConfig[issue.severity] || severityConfig["CODE SMELL"];

  return (
    <div className="border border-subtle bg-white shadow-xs p-4 mb-4 font-mono text-xs">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="bg-frame text-white text-[10px] font-bold px-1.5 py-0.5 select-none">
            {paddedIndex}
          </span>
          <span className="font-bold text-frame tracking-wider">
            LINE {issue.line}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${config.badge}`}
          >
            {issue.severity}
          </span>
        </div>
        <div className="text-zinc-500 text-[11px] text-right break-words max-w-[280px]">
          {issue.title}
        </div>
      </div>

      {/* Code Snippet */}
      {issue.codeSnippet && (
        <pre
          className={`my-3 p-3 bg-zinc-50 border border-subtle border-l-4 ${config.leftBorder} overflow-x-auto text-[11px] text-zinc-900 leading-relaxed font-mono`}
        >
          <code>{issue.codeSnippet}</code>
        </pre>
      )}

      {/* Diagnosis & Expected */}
      <div className="space-y-1.5 mt-2">
        <div className="text-zinc-800 leading-relaxed">
          <span className="text-accent font-bold mr-1.5">✕ Diagnosis:</span>
          <span>{issue.diagnosis}</span>
        </div>
        <div className="text-zinc-800 leading-relaxed">
          <span className="text-emerald-700 font-bold mr-1.5">✓ Expected:</span>
          <span>{issue.expected}</span>
        </div>
      </div>
    </div>
  );
}
