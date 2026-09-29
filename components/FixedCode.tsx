"use client";

import React, { useState } from "react";
import { LANGUAGES } from "@/config/app.config";
import { LanguageId } from "@/types/roast";
import { SectionHeader } from "./SectionHeader";

interface FixedCodeProps {
  sectionNumber: number | string;
  language: LanguageId;
  code: string;
  onApply: (fixedCode: string) => void;
}

export function FixedCode({
  sectionNumber,
  language,
  code,
  onApply,
}: FixedCodeProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  const extension =
    LANGUAGES.find((l) => l.id === language)?.extension || "txt";

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        setCopyStatus("copied");
      } else {
        setCopyStatus("failed");
      }
    } catch {
      setCopyStatus("failed");
    } finally {
      setTimeout(() => {
        setCopyStatus("idle");
      }, 2000);
    }
  };

  const copyLabel =
    copyStatus === "copied"
      ? "✓ COPIED TO CLIPBOARD"
      : copyStatus === "failed"
      ? "✕ COPY BLOCKED, SELECT MANUALLY"
      : "📋 COPY FIXED CODE";

  return (
    <div className="mt-6 mb-4">
      <SectionHeader number={sectionNumber} title="Fix">
        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider">
          CORRECTED CODE
        </span>
      </SectionHeader>

      <div className="border border-subtle bg-white shadow-xs">
        {/* Code block header strip */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-subtle bg-zinc-50 font-mono text-xs">
          <span className="font-bold text-frame">solution.{extension}</span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            READY TO APPLY
          </span>
        </div>

        {/* Code snippet */}
        <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-900 leading-relaxed max-h-[360px] overflow-y-auto">
          <code>{code}</code>
        </pre>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-t border-subtle bg-zinc-50">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 min-w-[140px] px-3 py-2 border border-frame bg-white text-frame hover:bg-frame hover:text-white transition-colors font-mono text-xs font-bold tracking-wider cursor-pointer"
          >
            {copyLabel}
          </button>
          <button
            type="button"
            onClick={() => onApply(code)}
            className="flex-1 min-w-[140px] px-3 py-2 border border-frame bg-frame text-white hover:bg-zinc-800 transition-colors font-mono text-xs font-bold tracking-wider cursor-pointer"
          >
            APPLY TO EDITOR ↵
          </button>
        </div>
      </div>
    </div>
  );
}
