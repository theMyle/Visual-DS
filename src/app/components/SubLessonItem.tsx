'use client'
import Link from "next/link";
import { useState } from "react";
import { cn } from "../lib/utils";

interface SubLessonItemProps {
    title: string;
    href: string;
}

export default function SubLessonItem({ title, href }: SubLessonItemProps) {
    const [status, setStatus] = useState(false);

    return (
        <div className="group flex items-center rounded-lg border-2 border-gray-300 h-20 transition-colors duration-150 hover:bg-gray-50">

            <Link
                href={href}
                className={cn(
                    "flex-1 flex items-center pl-10 pr-2 h-full text-gray-700",
                    status && "line-through text-gray-400 italic"
                )}
            >
                <li>{title}</li>
            </Link>

            {/* Checkbox container */}
            <div className="pr-6 flex items-center">
                <input
                    type="checkbox"
                    className="h-6 w-6 accent-green-600 cursor-pointer"
                    checked={status}
                    onChange={(e) => {
                        e.stopPropagation()
                        setStatus((s) => !s);
                    }}
                />
            </div>
        </div>
    );
}