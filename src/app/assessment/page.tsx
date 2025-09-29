import Link from "next/link";

export default function LessonPage() {
    return (
        <div
            className={"flex flex-col gap-5 items-center justify-center h-full"}
        >
            <h1 className={"text-4xl"}>Assessment</h1>

            <Link href={"/assessment/array-list"}>ArrayList</Link>
            <Link href={"/assessment/stack"}>Stack</Link>
            <Link href={"/assessment/queue"}>Queue</Link>
        </div>
    )
}