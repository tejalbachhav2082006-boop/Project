import React from "react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center h-full min-h-[320px]">
      <div className="w-16 h-16 border-2 border-frame flex items-center justify-center font-mono text-2xl font-bold text-frame mb-5 select-none bg-panel">
        <span className="inline-block animate-spin font-mono leading-none">/</span>
      </div>
      <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-frame mb-2 animate-pulse">
        Analyzing Code
      </h3>
      <p className="font-mono text-xs text-zinc-500 max-w-sm leading-relaxed">
        Evaluating computational complexity and architectural purity...
      </p>
    </div>
  );
}
