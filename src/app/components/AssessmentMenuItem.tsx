"use client";

import Link from "next/link";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type AssessmentMenuItemProps = {
    title: string;
    path: string;
    scoreHistory?: Array<{
        tryNumber: number;
        score: number;
        totalItems?: number;
        takenAt?: string;
        quizId?: string;
        quizCategory?: string;
    }>;
};

function formatTakenAt(value?: string): string {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
    });
}

export default function AssessmentMenuItem({
    title,
    path,
    scoreHistory = [],
}: AssessmentMenuItemProps) {
    const validAttempts = [...scoreHistory]
        .filter((point) => point.tryNumber >= 1 && point.tryNumber <= 10)
        .sort((a, b) => a.tryNumber - b.tryNumber);

    const chartData = Array.from({ length: 10 }, (_, index) => ({
        tryNumber: index + 1,
        score: undefined as number | undefined,
        takenAt: undefined as string | undefined,
    }));

    validAttempts.forEach((point) => {
        if (point.tryNumber < 1 || point.tryNumber > 10) {
            return;
        }

        chartData[point.tryNumber - 1] = {
            tryNumber: point.tryNumber,
            score: point.score,
            takenAt: point.takenAt,
        };
    });

    return (
        <Link
            href={path}
            className="w-full border-[1.5px] border-gray-300 rounded-lg px-4 py-3.5 bg-white hover:border-gray-400 transition-colors"
            style={{ boxShadow: "0 4px 20px rgba(116, 143, 252, 0.08)" }}
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
                    <div className="min-w-0 md:w-40 md:shrink-0 md:flex flex-col gap-5 justify-center">
                        <p className=" mt-0.5 text-lg md:text-2xl font-bold text-gray-900 leading-tight break-words">
                            {title}
                        </p>
                    </div>

                    <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 md:flex-1">
                        <div className="mb-1.5 flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                                Score history
                            </p>
                            <p className="text-[11px] text-gray-500">Hover points for details</p>
                        </div>

                        <div className="h-20 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 2, right: 4, left: -12, bottom: 0 }}
                                    barCategoryGap="12%"
                                >
                                    <XAxis
                                        dataKey="tryNumber"
                                        type="category"
                                        tick={false}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        dataKey="score"
                                        type="number"
                                        allowDecimals={false}
                                        domain={[0, 10]}
                                        ticks={[0, 10]}
                                        tick={{ fontSize: 10, fill: "#6b7280" }}
                                        width={20}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: "#93c5fd", strokeWidth: 1 }}
                                        content={({ active, payload }) => {
                                            const point = payload?.[0]?.payload as
                                                | { tryNumber?: number; score?: number; takenAt?: string }
                                                | undefined;

                                            if (!active || !point) {
                                                return null;
                                            }

                                            return (
                                                <div className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm">
                                                    <p className="font-semibold text-gray-700">
                                                        {formatTakenAt(point.takenAt)}
                                                    </p>
                                                    <p className="text-gray-600">Try: {point.tryNumber ?? "-"}</p>
                                                    <p className="text-gray-600">Score: {point.score ?? "-"}</p>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar
                                        dataKey="score"
                                        fill="#2563eb"
                                        radius={[2, 2, 0, 0]}
                                        maxBarSize={18}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-gray-500">
                    <span>Click to take assessment</span>
                    <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h9.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
