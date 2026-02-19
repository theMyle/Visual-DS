
interface SubLessonHeaderProps {
    title: string;
    description?: string;
}

export default function SubLessonHeader({ title, description }: SubLessonHeaderProps) {
    return (
        <div className="flex flex-col gap-4 bg-gray-100 rounded-lg px-4 py-4">
            <p className=" text-3xl font-bold">{title}</p>
            <p>{description}</p>
        </div>
    )
}