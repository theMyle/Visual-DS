import MenuItem from "../components/MenuItem";

export default function LessonPage() {
    return (
        <div className="flex w-full justify-center">
            <div
                className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
            >
                <p className="font-bold text-gray-700">Assessment</p>

                <MenuItem
                    title="Array"
                    path="/assessment/array-list"
                />

                {/* <Link href={"/assessment/stack"}>Stack</Link>
            <Link href={"/assessment/queue"}>Queue</Link>
            <Link href={"/assessment/test"}>Test</Link> */}
            </div>
        </div>
    )
}