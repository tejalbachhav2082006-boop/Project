"use client";

import React, { useRef, useState } from "react";
import { LANGUAGES } from "@/config/app.config";
import { LanguageId } from "@/types/roast";

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  language: LanguageId;
  errorLine?: number;
  onLoadSample: () => void;
}

export function CodeEditor({
  code,
  onChange,
  language,
  errorLine,
  onLoadSample,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const languageLabel =
    LANGUAGES.find((l) => l.id === language)?.label || language;

  const lines = code.split("\n");
  const lineCount = Math.max(lines.length, 10);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const textBefore = code.slice(0, start);
    const splitLines = textBefore.split("\n");
    const currentLine = splitLines.length;
    const currentCol = splitLines[splitLines.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 4 spaces
      target.setRangeText("    ", start, end, "end");
      onChange(target.value);
      updateCursorPosition();
    }
  };

  const handleClear = () => {
    onChange("");
    setCursorPos({ line: 1, col: 1 });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <section className="flex flex-col flex-1 w-full lg:w-[54%] min-h-[450px] bg-panel">
      {/* 40px Header Strip */}
      <div className="h-10 px-4 border-b border-subtle bg-zinc-50 flex items-center justify-between font-mono text-xs shrink-0">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
          INPUT // SRC
        </span>
        <span className="font-bold text-frame uppercase tracking-wider">
          Your Code
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-zinc-600 hover:text-frame font-bold uppercase tracking-wider text-[11px] underline underline-offset-2 cursor-pointer transition-colors"
          >
            SAMPLE BUG
          </button>
          <span className="text-zinc-300">|</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-zinc-600 hover:text-accent font-bold uppercase tracking-wider text-[11px] underline underline-offset-2 cursor-pointer transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Gutter + Textarea Row */}
      <div className="flex-1 flex relative overflow-hidden bg-white">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 bg-zinc-50 border-r border-subtle select-none font-mono text-xs text-zinc-400 py-3 text-right pr-2.5 overflow-hidden shrink-0"
        >
          {lineNumbers.map((num) => {
            const isError = errorLine === num;
            return (
              <div
                key={num}
                className={`leading-6 h-6 px-1 transition-colors ${
                  isError
                    ? "bg-red-100 text-accent font-bold border-r-2 border-accent"
                    : ""
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => {
            onChange(e.target.value);
            updateCursorPosition();
          }}
          onSelect={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          onClick={updateCursorPosition}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          wrap="off"
          placeholder="// Paste your code here..."
          className="flex-1 p-3 font-mono text-xs text-frame bg-transparent outline-none resize-none leading-6 whitespace-pre overflow-auto focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Bottom Status Strip */}
      <div className="h-8 px-4 border-t border-subtle bg-zinc-50 flex items-center justify-between font-mono text-[11px] text-zinc-500 shrink-0">
        <div>
          Ln {cursorPos.line}, Col {cursorPos.col} ·{" "}
          <span className="font-bold text-frame">{languageLabel}</span>
        </div>
        <div className="hidden sm:block text-zinc-400">
          UTF-8 · Tab Size: 4
        </div>
      </div>
    </section>
  );
}
