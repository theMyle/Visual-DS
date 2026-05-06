const PROGRESS_COLORS = {
    answered: '#4F46E5',    // Indigo-600
    unanswered: '#E5E7EB',  // Gray-200 
    currentRing: 'ring-indigo-500',
} as const;

interface ProgressDotsProps {
    current: number;
    total: number;
    answeredIndices: number[];
}

export default function ProgressDots({ current, total, answeredIndices }: ProgressDotsProps) {
    const isAnswered = (index: number) => answeredIndices.includes(index);
    const isCurrentDot = (index: number) => index === current;

    return (
        <div className="flex justify-center gap-2 md:gap-3 p-4 md:p-2 overflow-x-auto" role="list" aria-label="Progress">
            {Array.from({ length: total }, (_, index) => {
                const answered = isAnswered(index);
                const current = isCurrentDot(index);

                return (
                    <div
                        key={index}
                        role="listitem"
                        title={`Question ${index + 1} • ${answered ? 'Answered' : 'Unanswered'}${current ? ' (current)' : ''}`}
                        className={`rounded-full border transition-all duration-200
                            w-4 h-4 md:w-5 md:h-5
                            border-gray-300
                            ${current ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110 shadow-sm' : ''}
                            ${answered ? 'opacity-100' : 'opacity-80'}
                        `}
                        style={{ backgroundColor: answered ? PROGRESS_COLORS.answered : PROGRESS_COLORS.unanswered }}
                    />
                );
            })}
        </div>
    );
}