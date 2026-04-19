'use client';

type ChallengeInstructionsProps = {
    title: string;
    description: string;
    completed?: boolean;
    className?: string;
};

export default function ChallengeInstructions({
    title,
    description,
    completed = false,
    className,
}: ChallengeInstructionsProps) {
    const badgeLabel = completed ? "Completed" : "In Progress";
    const badgeClassName = completed
        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
        : "border-slate-300 bg-slate-100 text-slate-600";

    return (
        <div className={className ?? "border-b border-gray-200 bg-slate-50/90"}>
            <div className="px-4 md:px-6 py-4 md:py-5 h-36 md:h-40 flex flex-col">
                <div className="flex justify-between gap-3 pb-2 border-b border-slate-200/80">
                    <h2 className="my-0 self-center text-base md:text-lg font-semibold text-slate-800 leading-tight">{title}</h2>
                    <span className={`inline-flex self-center items-center rounded-full border px-3 py-1 text-[11px] md:text-xs font-semibold whitespace-nowrap ${badgeClassName}`}>
                        {badgeLabel}
                    </span>
                </div>

                <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
                    <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
            </div>
        </div>
    );
}
