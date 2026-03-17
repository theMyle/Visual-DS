import Link from "next/link";

type AssessmentMenuItemProps = {
    title: string;
    path: string;
    lastCorrectCount?: number;
    highestCorrectCount?: number;
    totalQuestions?: number;
};

export default function AssessmentMenuItem({
    title,
    path,
    lastCorrectCount,
    highestCorrectCount,
    totalQuestions,
}: AssessmentMenuItemProps) {
    const hasScore =
        typeof totalQuestions === "number" &&
        totalQuestions > 0 &&
        typeof lastCorrectCount === "number" &&
        typeof highestCorrectCount === "number";

    const lastScoreText = hasScore ? `${lastCorrectCount}/${totalQuestions}` : "-";
    const highestScoreText = hasScore ? `${highestCorrectCount}/${totalQuestions}` : "-";

    return (
        <Link
            href={path}
            className="w-full border-[1.5px] border-gray-300 rounded-lg px-4 py-3.5 bg-white hover:border-gray-400 transition-colors"
            style={{ boxShadow: "0 4px 20px rgba(116, 143, 252, 0.08)" }}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 w-full">
                <div className="min-w-0 flex-1 md:pr-2">
                    <p className="text-2xl font-bold text-gray-900 leading-tight break-words">{title}</p>
                </div>

                <div className="w-full md:w-[152px] md:shrink-0 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Last</p>
                        <p className="text-base font-bold text-gray-900">{lastScoreText}</p>
                    </div>
                    <div className="my-1.5 h-px bg-gray-200" />
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Highest</p>
                        <p className="text-base font-bold text-gray-900">{highestScoreText}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
