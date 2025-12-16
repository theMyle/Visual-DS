import MenuItem from "../components/MenuItem";

export default function LessonPage() {
    return (
        <div
            className={"flex flex-col gap-6 items-center justify-center my-6 mx-4"}
        >
            <p>Assessment</p>
            <MenuItem
                title="Array List - Assessment"
                path="/assessment/array-list"
            />

            {/* <Link href={"/assessment/stack"}>Stack</Link>
            <Link href={"/assessment/queue"}>Queue</Link>
            <Link href={"/assessment/test"}>Test</Link> */}
        </div>
    )
}