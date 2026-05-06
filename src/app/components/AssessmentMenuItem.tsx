"use client";

import Link from "next/link";

type ScorePoint = {
    tryNumber: number;
    score: number;
    totalItems?: number;
    takenAt?: string;
    quizId?: string;
    quizCategory?: string;
};

type AssessmentMenuItemProps = {
    title: string;
    path: string;
    maxAttempts: number | null;
    scoreHistory?: ScorePoint[];
    isLocked?: boolean;
};

function toPercent(score: number, totalItems?: number): number {
    if (!totalItems || totalItems === 0) return 0;
    return Math.round((score / totalItems) * 100);
}

export default function AssessmentMenuItem({
    title,
    path,
    maxAttempts,
    scoreHistory = [],
    isLocked = false,
}: AssessmentMenuItemProps) {
    const attemptsUsed = scoreHistory.length;
    
    // Find best attempt based on percentage
    const bestAttempt = scoreHistory.length > 0 
        ? scoreHistory.reduce((prev, curr) => 
            toPercent(curr.score, curr.totalItems) > toPercent(prev.score, prev.totalItems) ? curr : prev
          ) 
        : null;
    
    const bestPct = bestAttempt ? toPercent(bestAttempt.score, bestAttempt.totalItems) : null;

    const scoreColor = (pct: number) => {
        // Green if passing (>= 75%), otherwise Red
        if (pct >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-100";
        return "text-red-600 bg-red-50 border-red-100";
    };

    const content = (
        <>
            {/* Category title */}
            <div className="flex-1 min-w-0 pr-6">
                <p className={`font-bold text-2xl leading-tight truncate ${isLocked ? "text-gray-600" : "text-gray-800"}`}>
                    {title}
                </p>
            </div>

            {/* Assessment Stats */}
            <div className="flex items-center gap-6 shrink-0">
                {/* Score Pill: Showing Score / Total Items */}
                {bestAttempt && bestPct !== null ? (
                    <div className={`w-32 py-1.5 rounded-full border text-sm font-black whitespace-nowrap shadow-sm text-center ${scoreColor(bestPct)}`}>
                        {bestAttempt.score} <span className="opacity-40 text-[10px]">/</span> {bestAttempt.totalItems} <span className="text-[10px] ml-1 font-bold opacity-60 uppercase tracking-tighter">Best</span>
                    </div>
                ) : (
                    <div className="w-32 h-8" /> // Spacer for alignment
                )}

                {/* Attempt Counter */}
                <div className="flex flex-col items-end w-20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Attempts</p>
                    <p className={`text-sm font-black ${isLocked ? "text-gray-500" : "text-gray-600"}`}>
                        {attemptsUsed} <span className="text-gray-300 font-bold">/</span> {maxAttempts ?? "∞"}
                    </p>
                </div>

                {/* Arrow / Lock CTA */}
                <div className="pl-4 border-l border-gray-100 w-16 flex justify-center">
                    {isLocked ? (
                        <div className="flex flex-col items-center justify-center">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5 whitespace-nowrap">Locked</span>
                        </div>
                    ) : (
                        <svg className="h-6 w-6 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h9.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>
        </>
    );

    if (isLocked) {
        return (
            <div className="w-full flex items-center justify-between bg-white border-2 border-gray-100 border-dashed rounded-xl px-6 py-5 cursor-not-allowed">
                {content}
            </div>
        );
    }

    return (
        <Link
            href={path}
            className="group w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/30 transition-all duration-200"
        >
            {content}
        </Link>
    );
}
