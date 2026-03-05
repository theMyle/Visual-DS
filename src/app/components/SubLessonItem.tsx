'use client'
import Link from "next/link";
import { cn } from "../lib/utils";

interface SubLessonItemProps {
    title: string;
    href: string;
    status: boolean;
    onToggle: () => void;
}

export default function SubLessonItem({ title, href, status, onToggle }: SubLessonItemProps) {
    const dashIndex = title.indexOf("-");
    const left = dashIndex === -1 ? title : title.slice(0, dashIndex).trim();
    const right = dashIndex === -1 ? "" : title.slice(dashIndex + 1).trim();

    return (
        <div className={cn(
            "group flex items-center rounded-lg border-2 border-gray-300 h-20 transition-colors duration-150 hover:bg-gray-50",
        )}
        >

            <Link
                href={href}
                className={cn(
                    "flex-1 flex items-center pl-10 pr-2 h-full text-gray-700",
                    status && "line-through text-gray-400 italic"
                )}
            >
                <li>
                    {left} {right && <>- <strong>{right}</strong></>}
                </li>
            </Link>

            {/* Checkbox container */}
            <div className="pr-6 flex items-center">
                <input
                    type="checkbox"
                    className="h-6 w-6 accent-green-600 cursor-pointer"
                    checked={status}
                    readOnly
                    disabled
                    onChange={(e) => {
                        e.stopPropagation()
                        onToggle()
                    }}
                />
            </div>
        </div>
    );
}