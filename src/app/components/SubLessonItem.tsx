'use client'
import Link from "next/link";
import { cn } from "../lib/utils";
import { ACCENT_COLOR } from "../lib/constants";

interface SubLessonItemProps {
    index: number;
    title: string;
    href: string;
    status: boolean;
    onToggle?: () => void;
}

export default function SubLessonItem({ index, title, href, status }: SubLessonItemProps) {
    const dashIndex = title.indexOf("-");
    const left = dashIndex === -1 ? title : title.slice(0, dashIndex).trim();
    const right = dashIndex === -1 ? "" : title.slice(dashIndex + 1).trim();

    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center gap-6 p-4 rounded-xl border transition-all duration-200",
                "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-slate-50/50"
            )}
        >
            {/* Index Badge */}
            <div 
                className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full font-bold text-xs border transition-colors",
                    status 
                        ? "bg-green-50 border-green-300 text-green-700" 
                        : "bg-slate-50 border-gray-200 text-gray-500 group-hover:text-slate-900 group-hover:border-gray-300"
                )}
            >
                {status ? <CheckIcon /> : index}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <h3 className={cn(
                    "text-[15px] md:text-base font-bold transition-colors",
                    status ? "text-slate-400 line-through italic" : "text-slate-800"
                )}>
                    {left} {right && <span className="font-semibold opacity-60">- {right}</span>}
                </h3>
            </div>

            {/* Action Icon */}
            <div className={cn(
                "transition-colors",
                status ? "text-green-600" : "text-slate-300 group-hover:text-slate-600"
            )}>
                {status ? <CheckIcon /> : <ArrowRight />}
            </div>
        </Link>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    );
}