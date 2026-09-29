"use client";

import React from "react";
import { LANGUAGES, ROAST_LEVELS } from "@/config/app.config";
import { LanguageId, RoastLevel } from "@/types/roast";

interface RoastControlsProps {
  roastLevel: RoastLevel;
  onRoastLevelChange: (level: RoastLevel) => void;
  language: LanguageId;
  onLanguageChange: (lang: LanguageId) => void;
  onRoast: () => void;
  isRoasting: boolean;
  errorDrawerOpen: boolean;
  onToggleErrorDrawer: () => void;
}

export function RoastControls({
  roastLevel,
  onRoastLevelChange,
  language,
  onLanguageChange,
  onRoast,
  isRoasting,
  errorDrawerOpen,
  onToggleErrorDrawer,
}: RoastControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-xs">
      {/* 1. Roast Level Radio Group */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[11px] hidden sm:inline">
          Roast Level:
        </span>
        <div className="flex items-center gap-2">
          {ROAST_LEVELS.map((level) => {
            const isSelected = roastLevel === level.id;
            return (
              <label
                key={level.id}
                title={level.description}
                className={`flex items-center gap-1.5 px-2 py-1 border cursor-pointer transition-colors select-none ${
                  isSelected
                    ? "border-frame bg-frame text-white font-bold"
                    : "border-subtle bg-white text-zinc-600 hover:border-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="roastLevel"
                  value={level.id}
                  checked={isSelected}
                  onChange={() => onRoastLevelChange(level.id)}
                  className="sr-only"
                />
                <span
                  className={`w-2 h-2 rounded-full border ${
                    isSelected
                      ? "bg-accent border-accent"
                      : "bg-transparent border-zinc-400"
                  }`}
                />
                <span className="text-[11px]">{level.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Language Dropdown */}
      <div className="flex items-center gap-1.5">
        <label
          htmlFor="language-select"
          className="text-zinc-500 font-bold uppercase tracking-wider text-[11px] hidden sm:inline"
        >
          Language:
        </label>
        <div className="relative">
          <select
            id="language-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageId)}
            className="border border-subtle bg-white text-frame py-1 pl-2.5 pr-7 font-mono text-xs font-bold focus:outline-none focus:border-frame cursor-pointer appearance-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-zinc-500">
            ▾
          </span>
        </div>
      </div>

      {/* 3. Error Message Toggle Button */}
      <button
        type="button"
        onClick={onToggleErrorDrawer}
        className={`px-2.5 py-1 text-xs font-bold border transition-colors cursor-pointer ${
          errorDrawerOpen
            ? "bg-frame text-white border-frame"
            : "border-dashed border-zinc-400 bg-white text-zinc-700 hover:border-frame"
        }`}
      >
        {errorDrawerOpen ? "− ERROR MESSAGE" : "+ ERROR MESSAGE"}
      </button>

      {/* 4. Primary Roast Button */}
      <button
        type="button"
        onClick={onRoast}
        disabled={isRoasting}
        className={`flex items-center gap-2 px-4 py-1.5 bg-frame text-white font-mono text-xs font-bold uppercase tracking-wider border border-frame cursor-pointer transition-all ${
          isRoasting
            ? "opacity-80 cursor-wait animate-pulse"
            : "hover:bg-zinc-800 active:translate-y-px shadow-xs"
        }`}
      >
        {isRoasting ? (
          <span>ANALYZING...</span>
        ) : (
          <>
            <span>ROAST MY CODE</span>
            <span className="bg-zinc-800 text-zinc-300 text-[10px] px-1.5 py-0.5 border border-zinc-700 font-normal">
              Ctrl ⏎
            </span>
          </>
        )}
      </button>
    </div>
  );
}
