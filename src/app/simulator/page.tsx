
import MenuItem from "@/app/components/MenuItem";

export default function SimulatorPage() {
    return(
        <div
            className={"flex flex-col gap-6 items-center justify-center my-6 mx-4"}
        >
            <p className={""}>Simulator</p>
            <MenuItem title={"Array List - Simulator"} path={"/simulator/array-list"} />
            <MenuItem title={"Stack - Simulator"} path={"/simulator/stack"} />

            {
              /*
                <MenuItem title={"Queue - Simulator"} path={"/"} />
                <MenuItem title={"Map - Simulator"} path={"/"} />
              * */
            }
        </div>
    )
}
