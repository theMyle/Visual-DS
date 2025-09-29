
const PROGRESS_COLORS = {
    correct: '#22C55E',     // Green-500 
    incorrect: '#6B7280',   // Gray-500
    unanswered: '#E5E7EB',  // Gray-200 
    currentRing: 'ring-indigo-500',
} as const;

interface ProgressDotsProps {
    current: number;
    total: number;
    answeredCount: number;
    correct: boolean[];    // Track which answers were correct
}

export default function ProgressDots({ current, total, answeredCount, correct }: ProgressDotsProps) {
    const getDotColor = (index: number) => {
        if (index < answeredCount) {
            return correct[index] ? PROGRESS_COLORS.correct : PROGRESS_COLORS.incorrect;
        }
        return PROGRESS_COLORS.unanswered;
    };

    const isCurrentDot = (index: number) => index === current;

    return (
        <div className="flex justify-center gap-3 py-4">
            {Array.from({ length: total }, (_, index) => (
                <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${isCurrentDot(index) ? `ring-2 ${PROGRESS_COLORS.currentRing} ring-offset-1` : ''
                        }`}
                    style={{ backgroundColor: getDotColor(index) }}
                />
            ))}
        </div>
    );
}