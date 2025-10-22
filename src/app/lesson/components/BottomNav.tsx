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

    const onlyNext = !prev && !!next;
    const onlyPrev = !!prev && !next;

    return (
        <nav
            aria-label="Lesson navigation"
            className={`max-w-3xl mx-auto py-6 px-5 ${className}`}
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {prev && (
                    <Link
                        href={prev.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={{ backgroundColor: ACCENT_COLOR, color: "#ffffff" }}
                    >
                        <ChevronLeft />
                        <span>{prev.label ?? "Previous"}</span>
                    </Link>
                )}

                {next && (
                    <Link
                        href={next.href}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${onlyNext ? "md:ml-auto" : ""
                            }`}
                        style={{ backgroundColor: ACCENT_COLOR, color: "#ffffff" }}
                    >
                        <span>{next.label ?? "Next"}</span>
                        <ChevronRight />
                    </Link>
                )}
            </div>
        </nav>
    );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
            <path
                fill="currentColor"
                d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
            />
        </svg>
    );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
            <path
                fill="currentColor"
                d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
            />
        </svg>
    );
}
