import React from "react";
import { AI, APP } from "@/config/app.config";

interface StatusBarProps {
  isRoasting: boolean;
}

export function StatusBar({ isRoasting }: StatusBarProps) {
  return (
    <footer className="border-t-2 border-frame bg-panel px-4 py-2 font-mono text-[11px] text-zinc-500 select-none">
      {/* Primary Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-frame">STATUS:</span>
          {isRoasting ? (
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              PROCESSING...
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              ONLINE ({AI.modelLabel.toUpperCase()})
            </span>
          )}
          <span className="hidden sm:inline text-zinc-400">
            | ENGINE: GOOGLE GEMINI
          </span>
        </div>

        <div className="uppercase tracking-widest text-frame font-bold text-[10px]">
          {APP.name} {APP.version} // LIVE
        </div>
      </div>

      {/* Secondary Line: Workshop Attribution */}
      <div className="text-center text-[10px] text-zinc-400 mt-1 pt-1 border-t border-zinc-200/60">
        Made at GDG Nashik Pre-DevFest Workshop
      </div>
    </footer>
  );
}
