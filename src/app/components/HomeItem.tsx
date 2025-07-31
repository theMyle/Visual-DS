import Link from "next/link";

type HomeItemProps = {
    title: string;
    description: string;
    path: string;
}

export default function HomeItem({title, description, path}: HomeItemProps) {
    return (
        <div className={"flex flex-col gap-2 mx-4 border-[1.5px] border-[#94A6FF] rounded-3xl px-6 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"}>
            <h1 className={"text-[#5168DA] font-bold text-2xl"}>{title}</h1>
            <h2 className={"text-gray-500 text-base leading-5"}>
                {description}
            </h2>
            <Link
                href={path}
                className={"block bg-[#7B91FB] border-2 border-[#C0CBFF] text-white rounded-[10px] w-3/4 py-1 mt-3 my-1 mx-auto active:bg-[#687FF1] text-center"}
            >
                Explore {title}
            </Link>
        </div>
    );
}