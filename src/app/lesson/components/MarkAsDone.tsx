"use client";
import { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { LocalStorage } from "@/app/lib/localStorage";

interface MarkAsDoneProps {
    categorySlug: string; // e.g., "big-o-notation"
    href: string;         // e.g., "/lesson/big-o/introduction"
}

export default function MarkAsDone({ categorySlug, href }: MarkAsDoneProps) {
    const [isDone, setIsDone] = useState(false);

    // 1. On mount, find current state from LocalStorage
    useEffect(() => {
        const lessons = LocalStorage.getCategory(categorySlug);
        const current = lessons.find((l) => l.href === href);
        if (current) {
            setIsDone(current.completed);
        }
    }, [categorySlug, href]);

    // 2. Handle click: Update local UI AND persistent storage
    const handleToggle = () => {
        const newState = !isDone;
        setIsDone(newState);

        const lessons = LocalStorage.getCategory(categorySlug);
        const updated = lessons.map((l) =>
            l.href === href ? { ...l, completed: newState } : l
        );

        LocalStorage.setCategory(categorySlug, updated);
    };

    return (
        <div className="flex justify-center w-full py-10">
            <button
                onClick={handleToggle}
                className={cn(
                    "flex items-center justify-center gap-3 transition-all duration-300",
                    "w-72 h-11 rounded-full text-sm font-semibold tracking-wide shadow-sm",
                    isDone
                        ? "bg-green-100 text-green-700 shadow-inner"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.97]"
                )}
            >
                <CheckIcon isDone={isDone} />
                <span className="min-w-[100px] text-center uppercase tracking-widest text-[11px]">
                    {isDone ? "Lesson Completed" : "Mark as done"}
                </span>
            </button>
        </div>
    );
}

function CheckIcon({ isDone }: { isDone: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full transition-all duration-500",
            isDone
                ? "bg-green-600 text-white rotate-0"
                : "bg-gray-300 text-transparent -rotate-180"
        )}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={cn(
                    "w-3 h-3 transition-transform duration-300",
                    isDone ? "scale-100" : "scale-0"
                )}
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    );
}