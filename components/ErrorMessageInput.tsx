"use client";

import React from "react";

interface ErrorMessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

export function ErrorMessageInput({
  value,
  onChange,
  onClose,
}: ErrorMessageInputProps) {
  return (
    <div className="border-b-2 border-subtle bg-zinc-50 p-4 font-mono text-xs">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="error-trace-input"
          className="text-[11px] font-bold uppercase tracking-wider text-frame"
        >
          Attach Terminal Traceback / Compiler Error (Optional)
        </label>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-frame font-bold text-xs cursor-pointer transition-colors"
        >
          Dismiss ✕
        </button>
      </div>
      <textarea
        id="error-trace-input"
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. TypeError: unsupported operand type(s) for +=: 'int' and 'list' at line 7 in calculate_average"
        className="w-full border border-subtle bg-white p-2.5 font-mono text-xs text-frame placeholder:text-zinc-400 focus:outline-none focus:border-frame resize-y"
      />
    </div>
  );
}
