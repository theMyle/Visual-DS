import React from "react";

interface ChallengeLinkCardProps {
    href: string;
    label?: string;
}

export default function ChallengeLinkCard({
    href,
    label = "Practice Challenges",
}: ChallengeLinkCardProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-lg border-2 border-gray-300 px-6 py-4 text-gray-700 transition-colors duration-150 hover:bg-gray-50"
        >
            <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    LeetCode
                </span>
                <span className="text-base font-semibold">{label}</span>
            </div>

            <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="text-gray-500 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
            >
                <path d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </a>
    );
}