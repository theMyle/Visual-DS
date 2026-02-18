import Link from "next/link";

type LessonCategoryProps = {
    icon?: React.ReactNode;
    title: string;
    path: string;
    progress?: number;
};

export default function LessonCategory({ icon, title, path, progress = 0 }: LessonCategoryProps) {
    const isCompleted = progress === 100;
    progress = Math.floor(progress);

    return (
        <Link
            href={path}
            className="flex flex-col items-center gap-3 w-full border-2 border-gray-300 rounded-2xl px-5 py-4 bg-white hover:border-gray-400 transition-colors"
        >
            <div className="flex justify-between w-full items-baseline">
                <p className="text-2xl font-bold text-gray-900">{title}</p>
                <p className={`text-lg ${isCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                    {progress}%
                </p>
            </div>

            {/* Progress bar container */}
            <div className="w-full h-5 bg-[#EEEEEE] rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 rounded-2xl ${isCompleted ? 'bg-[#7CFF67]' : 'bg-[#7CFF67]'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="w-full flex justify-end">
                <p className={`font-bold ${isCompleted ? 'text-green-600' : 'text-green-600'}`}>
                    {isCompleted ? 'Completed 🎉🎉' : 'Continue Learning →'}
                </p>
            </div>
        </Link>
    );
}