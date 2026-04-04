import Link from "next/link";

type LessonCategoryProps = {
    icon?: React.ReactNode;
    title: string;
    path: string;
    progress?: number | null;
};

export default function LessonCategory({ icon, title, path, progress = 0 }: LessonCategoryProps) {
    const isLoading = progress === null;
    const safeProgress = isLoading ? 0 : Math.floor(progress);
    const isCompleted = safeProgress === 100;

    return (
        <Link
            href={path}
            className="flex flex-col items-center gap-3 w-full border-[1.5px] border-gray-300 rounded-lg px-3 py-4 bg-white hover:border-gray-400 transition-colors"
            style={{
                boxShadow: isCompleted
                    ? "0 4px 20px rgba(74, 222, 128, 0.1)"
                    : "0 4px 20px rgba(116, 143, 252, 0.08)"
            }}
        >
            <div className="flex justify-between w-full items-baseline">
                <p className="text-2xl font-bold">{title}</p>
                <p className={`text-lg ${isCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                    {isLoading ? "loading..." : `${safeProgress}%`}
                </p>
            </div>

            {/* Progress bar container */}
            <div className="w-full h-5 bg-[#EEEEEE] rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 rounded-2xl ${isCompleted ? 'bg-[#7CFF67]' : 'bg-[#7CFF67]'}`}
                    style={{ width: `${safeProgress}%` }}
                />
            </div>

            <div className="w-full flex justify-end text-xs md:text-sm">
                {isLoading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : safeProgress !== 0 ?
                    <p className={`font-bold ${isCompleted ? 'text-green-600' : 'text-green-600'}`}>
                        {isCompleted ? 'Completed!' : 'Continue Learning →'}
                    </p>
                    :
                    <p className="text-gray-500 ">Get Started</p>
                }
            </div>
        </Link>
    );
}