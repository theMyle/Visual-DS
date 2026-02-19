
import MenuItem from "@/app/components/MenuItem";

export default function SimulatorPage() {
  return (
    <div className="flex w-full justify-center">
      <div
        className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
      >
        <p className="font-bold text-gray-700">Simulator</p>
        <MenuItem title={"Array"} path={"/simulator/array-list"} />
        <MenuItem title={"Stack"} path={"/simulator/stack"} />
        <MenuItem title={"Queue"} path={"/simulator/queue"} />
        <MenuItem title={"Linked List"} path={"/simulator/linked-list"} />
        <MenuItem title={"Tree"} path={"/simulator/tree"} />
      </div>
    </div>
  )
}
