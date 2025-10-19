const PROGRESS_COLORS = {
    correct: '#22C55E',     // Green-500 
    incorrect: '#6B7280',   // Gray-500 or RED #EF4444
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
        <div className="flex justify-center gap-2 md:gap-3 p-4 md:p-2 overflow-x-auto" role="list" aria-label="Progress">
            {Array.from({ length: total }, (_, index) => (
                <div
                    key={index}
                    role="listitem"
                    title={`Question ${index + 1} • ${index < answeredCount
                        ? (correct[index] ? 'Correct' : 'Incorrect')
                        : 'Unanswered'
                        }${isCurrentDot(index) ? ' (current)' : ''}`}
                    className={`rounded-full border transition-all duration-200
                        w-4 h-4 md:w-5 md:h-5
                        border-gray-300
                        ${isCurrentDot(index) ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110 shadow-sm' : ''}
                        ${index < answeredCount ? 'opacity-100' : 'opacity-80'}
                    `}
                    style={{ backgroundColor: getDotColor(index) }}
                />
            ))}
        </div>
    );
}