"use client"

import Link from "next/link";

type Level = {
    id: number;
    title: string;
    path: string;
    next?: string;
    isCompleted: boolean;
};

type SimulatorMenuItemProps = {
    title: string;
    levels: Level[];
};

export default function SimulatorMenuItem({ title, levels }: SimulatorMenuItemProps) {
    const completedCount = levels.filter(l => l.isCompleted).length;
    const allDone = completedCount === levels.length && levels.length > 0;

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Category header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 ${allDone ? "bg-green-50" : "bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                    {allDone ? (
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </span>
                    )}
                    <span className="font-bold text-gray-800 text-base">{title}</span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${allDone ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                    {completedCount} / {levels.length}
                </span>
            </div>

            {/* Challenge list */}
            <ul className="divide-y divide-gray-100">
                {levels.map((level) => (
                    <li key={level.id}>
                        <Link
                            href={level.next
                                ? { pathname: level.path, query: { next: level.next } }
                                : level.path}
                            className={`flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 group
                                ${level.isCompleted
                                    ? "hover:bg-green-50"
                                    : "hover:bg-gray-50"
                                }`}
                        >
                            {/* Status icon */}
                            <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors
                                ${level.isCompleted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300 text-transparent group-hover:border-gray-400"
                                }`}>
                                {level.isCompleted && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </span>

                            {/* Index + Title */}
                            <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${level.isCompleted ? "text-green-600" : "text-gray-400"}`}>
                                {level.id}
                            </span>
                            <span className={`flex-1 text-sm font-medium ${level.isCompleted ? "text-gray-600" : "text-gray-800"}`}>
                                {level.title}
                            </span>

                            {/* Arrow */}
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 ${level.isCompleted ? "text-green-400" : "text-gray-300 group-hover:text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}