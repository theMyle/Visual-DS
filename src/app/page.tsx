import HomeItem from "@/app/components/HomeItem";

export default function App() {
    return (
        <div className={"flex flex-col gap-12 justify-center items-center py-12 mx-6"}>
            {/* title */}
            <h1 className={"text-4xl text-center font-bold"}>Learn all about Data Structures</h1>

            {/* sub heading */}
            <h2 className={"text-center text-base text-gray-500"}>
                Visual-DS is an e-learning platform built around an interactive simulator
                that helps you explore data structure properties, operations,
                and applications at your own pace.
            </h2>

            {/* sub pages card */}
            <HomeItem
                title={"Lessons"}
                description={"Dive deep into the core of data structures with clear, structured lessons. Learn about the fundamental properties and operations of various structures, forming the essential foundation for your understanding."}
                path={"/lesson"}
                />
            <HomeItem
                title={"Simulator"}
                description={"Experience data structures in action! Our dedicated simulator allows you to interact directly with different data structures, performing operations and see instant visual feedback."}
                path={"/simulator"}
                />
            <HomeItem
                title={"Assessment"}
                description={"Test your knowledge and track your progress. Our self-assessment modules are built to check your understanding and help you move forward with confidence."}
                path={"/assessment"}
                />

        </div>
    )
}
