
import MenuItem from "@/app/components/MenuItem";
import SimulatorMenuItem from "./components/SimulatorMenuItem";

export default function SimulatorPage() {
  return (
    <div className="flex w-full justify-center">
      <div
        className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
      >
        <p className="font-bold text-gray-700">Simulator</p>
        <SimulatorMenuItem title={"Array"} levels={[
          {
            id: 1,
            path: "/simulator/array/challenge-1",
            next: "/simulator/array/challenge-2",
            isCompleted: false
          },
          {
            id: 2, path: "/simulator/array/challenge-2",
            next: "/simulator/array/challenge-3",
            isCompleted: false
          },
          {
            id: 3, path: "/simulator/array/challenge-3",
            next: "/simulator/array/challenge-4",
            isCompleted: false
          },
          {
            id: 4, path: "/simulator/array/challenge-4",
            next: "/simulator/array/challenge-5",
            isCompleted: false
          },
          {
            id: 5, path: "/simulator/array/challenge-5",
            next: "/simulator",
            isCompleted: false
          },
        ]} />

        <SimulatorMenuItem title={"Linked List"} levels={[
          {
            id: 1, path: "/simulator/linked-list/challenge-1",
            next: "/simulator/linked-list/challenge-2",
            isCompleted: false
          },
          {
            id: 2, path: "/simulator/linked-list/challenge-2",
            next: "/simulator/linked-list/challenge-3",
            isCompleted: false
          },
          {
            id: 3, path: "/simulator/linked-list/challenge-3",
            next: "/simulator/linked-list/challenge-4",
            isCompleted: false
          },
          {
            id: 4, path: "/simulator/linked-list/challenge-4",
            next: "/simulator/linked-list/challenge-5",
            isCompleted: false
          },
          {
            id: 5, path: "/simulator/linked-list/challenge-5",
            next: "/simulator",
            isCompleted: false
          },
        ]} />

        <SimulatorMenuItem title={"Stack"} levels={[
          {
            id: 1, path: "/simulator/stack/challenge-1",
            next: "/simulator/stack/challenge-2",
            isCompleted: false
          },
          {
            id: 2, path: "/simulator/stack/challenge-2",
            next: "/simulator/stack/challenge-3",
            isCompleted: false
          },
          {
            id: 3, path: "/simulator/stack/challenge-3",
            next: "/simulator/stack/challenge-4",
            isCompleted: false
          },
          {
            id: 4, path: "/simulator/stack/challenge-4",
            next: "/simulator/stack/challenge-5",
            isCompleted: false
          },
          {
            id: 5, path: "/simulator/stack/challenge-5",
            next: "/simulator",
            isCompleted: false
          },
        ]} />

        <SimulatorMenuItem title={"Queue"} levels={[
          {
            id: 1, path: "/simulator/queue/challenge-1",
            next: "/simulator/queue/challenge-2",
            isCompleted: false
          },
          {
            id: 2, path: "/simulator/queue/challenge-2",
            next: "/simulator/queue/challenge-3",
            isCompleted: false
          },
          {
            id: 3, path: "/simulator/queue/challenge-3",
            next: "/simulator/queue/challenge-4",
            isCompleted: false
          },
          {
            id: 4, path: "/simulator/queue/challenge-4",
            next: "/simulator/queue/challenge-5",
            isCompleted: false
          },
          {
            id: 5, path: "/simulator/queue/challenge-5",
            next: "/simulator",
            isCompleted: false
          },
        ]} />

        <SimulatorMenuItem title={"Tree"} levels={[
          {
            id: 1, path: "/simulator/tree/challenge-1",
            next: "/simulator/tree/challenge-2",
            isCompleted: false
          },
          {
            id: 2, path: "/simulator/tree/challenge-2",
            next: "/simulator/tree/challenge-3",
            isCompleted: false
          },
          {
            id: 3, path: "/simulator/tree/challenge-3",
            next: "/simulator/tree/challenge-4",
            isCompleted: false
          },
          {
            id: 4, path: "/simulator/tree/challenge-4",
            next: "/simulator/tree/challenge-5",
            isCompleted: false
          },
          {
            id: 5, path: "/simulator/tree/challenge-5",
            next: "/simulator",
            isCompleted: false
          },
        ]} />

      </div>
    </div>
  )
}
