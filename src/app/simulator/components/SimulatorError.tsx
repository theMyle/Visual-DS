'use client';

import React from 'react';
import Link from 'next/link';

interface SimulatorErrorProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export default function SimulatorError({
  message = "We couldn't load the simulator content. This might be due to a temporary connection issue.",
  onRetry,
  title = "Failed to Load Simulator"
}: SimulatorErrorProps) {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col w-full gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
              >
                Try Again
              </button>
            )}

            <Link
              href="/simulator"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
            >
              Back to Curriculum
            </Link>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 text-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            Error Diagnostic: 0xFETCH_FAIL
          </p>
        </div>
      </div>
    </div>
  );
}
