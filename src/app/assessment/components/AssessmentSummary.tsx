import CircularProgress from "./CircularProgress";

type AssessmentSummaryProps = {
    correctCount: number;
    totalQuestions: number;
    onRetry: () => void;
    onBackToHome: () => void;
}

export default function AssessmentSummary({
    correctCount,
    totalQuestions,
    onRetry,
    onBackToHome
}: AssessmentSummaryProps) {
    const percentage = (correctCount / totalQuestions) * 100;

    // Determine message based on performance
    let message = "";
    let messageColor = "";

    if (percentage === 100) {
        message = "Well Done! You Mastered It! 🏆";
        messageColor = "text-green-600";
    } else if (percentage >= 80) {
        message = "Good Job! 👍";
        messageColor = "text-green-600";
    } else if (percentage >= 50) {
        message = "Hmm, Keep Practicing! 💪";
        messageColor = "text-yellow-600";
    } else {
        message = "Review More! 📚";
        messageColor = "text-orange-600";
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 space-y-4 opacity-0 animate-fade-in">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        Assessment Complete!
                    </h1>
                    <p className="text-sm text-gray-600">
                        Here&apos;s how you did
                    </p>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center py-3">
                    <CircularProgress percentage={percentage} size={140} strokeWidth={12} />
                </div>

                {/* Score Display */}
                <div className="text-center space-y-2">
                    <h2 className={`text-lg md:text-xl font-bold ${messageColor}`}>
                        {message}
                    </h2>
                    <p className="text-base md:text-lg text-gray-700">
                        <span className="font-bold text-indigo-600">{correctCount}</span> out of{" "}
                        <span className="font-bold text-indigo-600">{totalQuestions}</span> correct
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={onRetry}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-lg text-base transition-all shadow-md hover:shadow-lg"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="flex-1 bg-white hover:bg-gray-50 active:bg-gray-100 text-indigo-600 font-semibold py-3 px-4 rounded-lg text-base border-2 border-indigo-600 transition-all shadow-md hover:shadow-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
