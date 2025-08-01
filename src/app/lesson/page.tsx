import MenuItem from "@/app/components/MenuItem";

export default function LessonPage() {
    return(
        <div
            className={"flex flex-col gap-6 items-center justify-center my-6 mx-4"}
        >
            <p className={""}>Lessons</p>
            <MenuItem title={"Introduction to Data Structures"} path={"/"} />
            <MenuItem title={"Time and Space Complexity"} path={"/"} />
            <MenuItem title={"Array List"} path={"/"} />
            <MenuItem title={"Stack"} path={"/"} />
            <MenuItem title={"Queue"} path={"/"} />
            <MenuItem title={"Map"} path={"/"} />
        </div>
    )
}