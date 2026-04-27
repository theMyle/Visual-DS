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
    scoreHistory?: ScorePoint[];
};

function toPercent(score: number, totalItems?: number): number {
    if (!totalItems || totalItems === 0) return 0;
    return Math.round((score / totalItems) * 100);
}

function formatDate(value?: string): string {
    if (!value) return "–";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "–";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function barColor(pct: number): string {
    if (pct >= 80) return "bg-emerald-400";
    if (pct >= 50) return "bg-amber-400";
    return "bg-red-400";
}

export default function AssessmentMenuItem({
    title,
    path,
    scoreHistory = [],
}: AssessmentMenuItemProps) {
    const sorted = [...scoreHistory]
        .filter(p => p.tryNumber >= 1 && p.tryNumber <= 10)
        .sort((a, b) => a.tryNumber - b.tryNumber);

    // Build fixed 10-slot array
    const slots = Array.from({ length: 10 }, (_, i) => {
        const found = sorted.find(p => p.tryNumber === i + 1);
        if (!found) return { tryNumber: i + 1, pct: null as number | null, takenAt: undefined as string | undefined, score: undefined as number | undefined, totalItems: undefined as number | undefined };
        return {
            tryNumber: i + 1,
            pct: toPercent(found.score, found.totalItems),
            takenAt: found.takenAt,
            score: found.score,
            totalItems: found.totalItems,
        };
    });

    return (
        <Link
            href={path}
            className="group w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200"
        >
            {/* Category title */}
            <div className="flex-1 min-w-0 pr-6">
                <p className="font-bold text-gray-800 text-2xl leading-tight truncate">{title}</p>
            </div>

            {/* 10-session bar strip */}
            <div className="flex flex-col gap-1.5 w-64 shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Recent Attempts</p>
                <div className="flex items-end gap-2 h-10 w-full">
                    {slots.map(slot => (
                        <div
                            key={slot.tryNumber}
                            className="relative flex-1 flex flex-col justify-end h-full group/bar"
                            title={slot.pct !== null
                                ? `#${slot.tryNumber} · ${formatDate(slot.takenAt)} · ${slot.score}/${slot.totalItems} (${slot.pct}%)`
                                : `#${slot.tryNumber} · not taken`}
                        >
                            {slot.pct !== null ? (
                                <div
                                    className={`w-full rounded-sm ${barColor(slot.pct)} transition-opacity group-hover/bar:opacity-80`}
                                    style={{ height: `${Math.max(slot.pct, 15)}%` }}
                                />
                            ) : (
                                <div className="w-full rounded-sm bg-gray-100" style={{ height: "15%" }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrow CTA */}
            <div className="pl-6 shrink-0">
                <svg className="h-6 w-6 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1.5 transition-all" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h9.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </div>
        </Link>
    );
}
