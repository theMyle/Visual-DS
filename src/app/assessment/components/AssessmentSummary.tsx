import CircularProgress from "./CircularProgress";

type AssessmentSummaryProps = {
    correctCount: number;
    totalQuestions: number;
    isSyncing?: boolean;
    showLoginButton?: boolean;
    onLoginToSaveProgress?: () => void;
    onRetry: () => void;
    onBackToHome: () => void;
}

export default function AssessmentSummary({
    correctCount,
    totalQuestions,
    isSyncing = false,
    showLoginButton = false,
    onLoginToSaveProgress,
    onRetry,
    onBackToHome
}: AssessmentSummaryProps) {
    const percentage = (correctCount / totalQuestions) * 100;
    const incorrectCount = totalQuestions - correctCount;

    let message = "";
    let messageColor = "text-slate-700";
    let statusLabel = "Needs Review";
    let statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";

    if (percentage === 100) {
        message = "Outstanding result. Full mastery achieved.";
        messageColor = "text-emerald-700";
        statusLabel = "Mastered";
        statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (percentage >= 80) {
        message = "Strong performance with solid understanding.";
        messageColor = "text-emerald-700";
        statusLabel = "Proficient";
        statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (percentage >= 50) {
        message = "You are on track. A quick review will improve consistency.";
        messageColor = "text-amber-700";
        statusLabel = "Developing";
        statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    } else {
        message = "Focus on fundamentals, then retake this assessment.";
        messageColor = "text-rose-700";
        statusLabel = "Foundational";
        statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
    }

    return (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-start md:justify-center p-4 pt-6 md:pt-4 bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
            <div className="max-w-2xl w-full rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] p-6 md:p-8 space-y-6 opacity-0 animate-fade-in">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Assessment Result
                        </p>
                        <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
                            Completed
                        </h1>
                    </div>
                    <div className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${statusBadgeClass}`}>
                        {statusLabel}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 md:gap-6 items-center">
                    <div className="flex justify-center md:justify-start">
                        <CircularProgress percentage={percentage} size={160} strokeWidth={11} />
                    </div>

                    <div className="space-y-3">
                        <h2 className={`text-lg md:text-xl font-semibold ${messageColor}`}>
                            {message}
                        </h2>
                        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                            Your final score is <span className="font-semibold text-slate-900">{Math.round(percentage)}%</span>.
                        </p>

                        <div className="grid grid-cols-3 gap-3 pt-1">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Correct</p>
                                <p className="mt-1 text-lg font-semibold text-emerald-700">{correctCount}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Incorrect</p>
                                <p className="mt-1 text-lg font-semibold text-rose-700">{incorrectCount}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                                <p className="mt-1 text-lg font-semibold text-slate-800">{totalQuestions}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-600">
                        You answered <span className="font-semibold text-slate-900">{correctCount}</span> out of <span className="font-semibold text-slate-900">{totalQuestions}</span> questions correctly.
                    </p>
                    {isSyncing && (
                        <p className="mt-2 text-xs font-medium text-slate-500">
                            Syncing...
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                        onClick={onRetry}
                        className="flex-1 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-3 px-4 text-base transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="flex-1 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold py-3 px-4 text-base border border-slate-300 transition-colors"
                    >
                        Back to Assessments
                    </button>
                </div>

                {showLoginButton && onLoginToSaveProgress && (
                    <div className="flex justify-center pt-1">
                        <button
                            onClick={onLoginToSaveProgress}
                            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 px-4 text-base transition-colors"
                        >
                            Login to Save Progress
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
