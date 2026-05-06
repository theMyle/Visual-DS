import type { Question } from "../types";

type AssessmentSummaryProps = {
    questions: Question[];
    selectedAnswers: Record<string, string>;
    correctCount: number;
    totalQuestions: number;
    isSyncing?: boolean;
    showLoginButton?: boolean;
    canRetry?: boolean;
    attemptsRemaining?: number | null;
    onLoginToSaveProgress?: () => void;
    onRetry: () => void;
    onBackToHome: () => void;
}

export default function AssessmentSummary({
    questions,
    selectedAnswers,
    correctCount,
    totalQuestions,
    isSyncing = false,
    showLoginButton = false,
    canRetry = true,
    attemptsRemaining = null,
    onLoginToSaveProgress,
    onRetry,
    onBackToHome
}: AssessmentSummaryProps) {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const incorrectCount = totalQuestions - correctCount;

    return (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-50">
            <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

                {/* Score Header */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Assessment Complete</p>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-5xl font-black text-slate-900">{percentage}%</h1>
                        <p className="text-slate-500 font-medium">{correctCount} of {totalQuestions} correct</p>
                    </div>

                    {/* Score bar */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                        <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center">
                            <p className="text-xl font-bold text-emerald-700">{correctCount}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-0.5">Correct</p>
                        </div>
                        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-center">
                            <p className="text-xl font-bold text-red-600">{incorrectCount}</p>
                            <p className="text-xs text-red-500 font-medium mt-0.5">Incorrect</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                            <p className="text-xl font-bold text-slate-700">{totalQuestions}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Total</p>
                        </div>
                    </div>
                </div>

                {/* Review Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Review</p>
                        {isSyncing && (
                            <p className="text-xs text-slate-400 animate-pulse">Syncing...</p>
                        )}
                    </div>

                    {questions.map((question, index) => {
                        const selectedId = selectedAnswers[question.id];
                        const selectedChoice = question.choices.find(c => c.id === selectedId);
                        const isCorrect = selectedChoice?.is_correct ?? false;

                        return (
                            <div
                                key={question.id}
                                className={`rounded-xl border-l-4 bg-white border border-l-4 p-5 space-y-3 ${
                                    isCorrect
                                        ? "border-slate-100 border-l-emerald-400"
                                        : "border-slate-100 border-l-red-400"
                                }`}
                            >
                                {/* Question header */}
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                        isCorrect ? "bg-emerald-500" : "bg-red-400"
                                    }`}>
                                        {isCorrect ? (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                                        <span className="text-slate-400 font-normal mr-1">{index + 1}.</span>
                                        {question.text}
                                    </p>
                                </div>

                                {/* Answer & Feedback */}
                                <div className="ml-8 space-y-2.5">
                                    <div className="flex items-start gap-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14 flex-shrink-0 pt-0.5">Answer</p>
                                        <p className={`text-sm font-semibold ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                                            {selectedChoice?.text ?? "—"}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14 flex-shrink-0 pt-0.5">Note</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {isCorrect ? question.feedback.correct : question.feedback.incorrect}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pb-12">
                    {canRetry ? (
                        <button
                            onClick={onRetry}
                            disabled={isSyncing}
                            className={`flex-1 flex flex-col items-center justify-center font-semibold py-3 rounded-xl transition-all ${
                                isSyncing 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-slate-900 text-white hover:bg-slate-800 active:bg-black"
                            }`}
                        >
                            <span className="text-sm">Try Again</span>
                            {attemptsRemaining !== null && (
                                <span className={`text-[10px] font-medium ${isSyncing ? "text-slate-300" : "text-slate-400"}`}>
                                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} left
                                </span>
                            )}
                        </button>
                    ) : (
                        <button
                            disabled
                            className="flex-1 flex flex-col items-center justify-center bg-slate-100 text-slate-400 font-semibold py-3 rounded-xl cursor-not-allowed"
                        >
                            <span className="text-sm">No Attempts Left</span>
                            <span className="text-[10px] font-medium">Limit reached</span>
                        </button>
                    )}
                    <button
                        onClick={onBackToHome}
                        disabled={isSyncing}
                        className={`flex-1 font-semibold py-3 rounded-xl transition-colors text-sm border ${
                            isSyncing
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                        }`}
                    >
                        Back to Assessments
                    </button>
                </div>

                {showLoginButton && onLoginToSaveProgress && (
                    <div className="flex justify-center -mt-8 pb-8">
                        <button
                            onClick={onLoginToSaveProgress}
                            className="text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium underline underline-offset-4"
                        >
                            Login to save your progress
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
