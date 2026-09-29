import React from "react";

interface ErrorStateProps {
  error?: string | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center h-full min-h-[320px]">
      <div className="w-16 h-16 border-2 border-accent flex items-center justify-center font-mono text-2xl font-bold text-accent mb-5 select-none bg-panel">
        !
      </div>
      <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-accent mb-2">
        Analysis Failed
      </h3>
      <p className="font-mono text-xs text-zinc-600 max-w-md leading-relaxed mb-6 break-words">
        {error || "An unknown error occurred during code evaluation."}
      </p>
      <button
        onClick={onRetry}
        type="button"
        className="px-4 py-2 bg-frame text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors border border-frame cursor-pointer"
      >
        RETRY ANALYSIS ↵
      </button>
    </div>
  );
}
