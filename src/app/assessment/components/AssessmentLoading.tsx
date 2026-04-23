type AssessmentLoadingProps = {
    label?: string;
};

export default function AssessmentLoading({
    label = "Preparing assessment",
}: AssessmentLoadingProps) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400" />
                        <span
                            className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400"
                            style={{ animationDelay: "120ms" }}
                        />
                        <span
                            className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400"
                            style={{ animationDelay: "240ms" }}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="h-8 w-full animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-8 w-5/6 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-100" />
                </div>

                <p className="mt-6 text-sm text-slate-500">{label}...</p>
            </div>
        </div>
    );
}
