import React from "react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center h-full min-h-[320px]">
      <div className="w-16 h-16 border-2 border-dashed border-subtle flex items-center justify-center font-mono text-2xl font-bold text-muted-foreground mb-5 select-none text-zinc-400">
        {"{}"}
      </div>
      <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-frame mb-2">
        Awaiting Code Submission
      </h3>
      <p className="font-mono text-xs text-zinc-500 max-w-sm leading-relaxed">
        Paste your code on the left, then click &quot;ROAST MY CODE&quot; or press Ctrl+Enter (⌘+Enter on Mac).
      </p>
    </div>
  );
}
