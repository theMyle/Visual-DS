import MenuItem from "@/app/components/MenuItem";

export default function LessonPage() {
  return (
    <div
      className={"flex flex-col gap-6 items-center justify-center my-6 mx-4"}
    >
      <p className={""}>Lessons</p>
      <MenuItem title={"Introduction to Data Structures"} path={"/lesson/introduction"} />
      <MenuItem title={"Big-O"} path={"/lesson/big-o"} />
      <MenuItem title={"Array List"} path={"/lesson/arraylist"} />
      <MenuItem title={"Array List v2"} path={"/lesson/arraylist-v2"} />

      {
        /*
        <MenuItem title={"Stack"} path={"/"} />
        <MenuItem title={"Queue"} path={"/"} />
        <MenuItem title={"Map"} path={"/"} />
        * */
      }
    </div>
  )
}
