import MenuItem from "@/app/components/MenuItem";
import LessonCategory from "../components/LessonCategory";

export default function LessonPage() {
  return (
    <div
      className={"flex flex-col gap-6 items-center justify-center my-6 w-full px-4 md:max-w-[50%] md:mx-auto"}
    >
      <p className={""}>Lessons</p>
      <LessonCategory title={"Sample Lesson"} path={"/lesson/sample-lesson"} progress={22.1} />
      <LessonCategory title={"Introduction to Data Structures"} path={"/lesson/introduction"} progress={20} />
      <LessonCategory title={"Big-O"} path={"/lesson/big-o"} progress={100} />
      <LessonCategory title={"Array List"} path={"/lesson/arraylist"} progress={22.1} />
    </div>
  )
}
