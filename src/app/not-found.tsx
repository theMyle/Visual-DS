import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-full gap-8 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold">404 | Page Not Found</h2>
            <Link
                href={"/"}
                className={"bg-[#7B91FB] border-2 border-[#C0CBFF] text-white rounded-[10px] px-8 py-2 active:bg-[#687FF1]"}
            >
                Home
            </Link>
        </div>
    );
}
