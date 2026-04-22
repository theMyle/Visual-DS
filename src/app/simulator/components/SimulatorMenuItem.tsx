"use client"

import Link from "next/link";

type Level = {
    id: number;
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
    const progress = levels.length > 0 ? (completedCount / levels.length) * 100 : 0;
    const isCompleted = progress === 100;

    return (
        <div
            className="flex flex-col gap-5 w-full border-[1.5px] border-gray-300 rounded-lg px-5 py-6 bg-white transition-all"
            style={{
                boxShadow: isCompleted
                    ? "0 4px 20px rgba(74, 222, 128, 0.15)"
                    : "0 4px 20px rgba(0, 0, 0, 0.05)"
            }}
        >
            {/* Header - Now includes the count for context since bar is gone */}
            <div className="flex justify-between w-full items-center">
                <p className="text-2xl font-bold text-gray-800">{title}</p>
                <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">
                    {completedCount} / {levels.length} Tasks Completed
                </p>
            </div>

            {/* Level Grid - Increased gap and text size */}
            <div className="w-full grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {levels.map((level) => (
                    <Link
                        key={level.id}
                        href={level.next
                            ? { pathname: level.path, query: { next: level.next } }
                            : level.path}
                        className={`
                            flex items-center justify-center aspect-square rounded-xl border-2 transition-all duration-200 
                            ${level.isCompleted
                                ? 'bg-green-400 border-green-600 text-white shadow-sm'
                                : 'bg-white border-gray-300 text-gray-400 hover:border-gray-500 hover:bg-gray-50'}
                        `}
                    >
                        <span className="text-xl font-black">{level.id}</span>
                    </Link>
                ))}
            </div>
        </div >
    );
}