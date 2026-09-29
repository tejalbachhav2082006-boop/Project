import React from "react";
import { APP } from "@/config/app.config";

interface TopBarProps {
  children?: React.ReactNode;
}

export function TopBar({ children }: TopBarProps) {
  return (
    <header className="border-b-2 border-frame bg-panel px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: App Title + Version Tag */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <h1 className="font-sans text-xl md:text-2xl font-black uppercase tracking-wider text-frame select-none">
          {APP.name}
        </h1>
        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 border border-frame text-frame bg-white uppercase select-none">
          {APP.version}
        </span>
      </div>

      {/* Right: Controls */}
      <div className="w-full md:w-auto flex justify-end">
        {children}
      </div>
    </header>
  );
}
