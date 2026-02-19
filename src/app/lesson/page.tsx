import LessonCategory from "../components/LessonItem";
import { LocalStorage } from "../lib/localStorage";

export default function LessonPage() {
  const storage = new LocalStorage();

  return (
    <div className="flex items-center w-full justify-center">
      <div
        className={"flex flex-col gap-6 items-center justify-center my-6 w-full px-4 max-w-3xl"}
      >
        <LessonCategory title={"Sample Lesson"} path={"/lesson/sample-lesson"} progress={22.1} />
        <LessonCategory title={"Introduction to Data Structures"} path={"/lesson/introduction"} progress={20} />
        <LessonCategory title={"Big-O"} path={"/lesson/big-o"} progress={100} />

        <LessonCategory title={"Array"} path={"/lesson/arraylist"} progress={22.1} />
        <LessonCategory title={"Stack"} path={"/lesson/stack"} progress={22.1} />
        <LessonCategory title={"Queue"} path={"/lesson/queue"} progress={22.1} />
        <LessonCategory title={"Linked List"} path={"/lesson/linkedlist"} progress={22.1} />
        <LessonCategory title={"Tree"} path={"/lesson/tree"} progress={22.1} />
      </div>
    </div>
  )
}
