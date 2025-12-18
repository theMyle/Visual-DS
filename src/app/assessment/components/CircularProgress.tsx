type CircularProgressProps = {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

export default function CircularProgress({ percentage, size = 200, strokeWidth = 12 }: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Color based on percentage
    let strokeColor = "#ef4444"; // red-500 for poor performance
    if (percentage >= 80) {
        strokeColor = "#22c55e"; // green-500 for great performance
    } else if (percentage >= 60) {
        strokeColor = "#eab308"; // yellow-500 for good performance
    } else if (percentage >= 40) {
        strokeColor = "#f97316"; // orange-500 for okay performance
    }

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            {/* Percentage text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-gray-800">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
}
