"use client";
import Link from "next/link";
import { ACCENT_COLOR } from "@/app/lib/constants";
import React from "react";

type NavEnd = {
    href: string;
    label?: string;
};

export default function BottomNav({
    prev,
    next,
    className = "",
}: {
    prev?: NavEnd;
    next?: NavEnd;
    className?: string;
}) {
    if (!prev && !next) return null;

    const baseLinkClass = "group flex flex-col gap-1 p-4 rounded-2xl transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-100 active:scale-[0.98]";

    return (
        <nav
            aria-label="Lesson navigation"
            className={`max-w-3xl mx-auto py-12 px-6 ${className}`}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Previous Link */}
                <div className="flex justify-start">
                    {prev && (
                        <Link href={prev.href} className={baseLinkClass}>
                            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-gray-500">
                                <ChevronLeft /> Previous
                            </span>
                            <span className="text-sm md:text-base font-bold text-gray-800 ml-5">
                                {prev.label}
                            </span>
                        </Link>
                    )}
                </div>

                {/* Next Link */}
                <div className="flex justify-end text-right">
                    {next && (
                        <Link href={next.href} className={baseLinkClass}>
                            <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT_COLOR }}>
                                Next <ChevronRight />
                            </span>
                            <span className="text-sm md:text-base font-bold text-gray-800 mr-5">
                                {next.label}
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

function ChevronLeft() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ChevronRight() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}