import Link from "next/link";

type MenuItemProps = {
    icon?: React.ReactNode;
    title: string;
    path: string;
}

export default function MenuItem({icon, title, path} : MenuItemProps) {
    return(
        <Link
            href={path}
            className={"w-full border-[#94A6FF] border-[1.5px] rounded-xl px-4 py-4 " +
                "active:bg-blue-200 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"}
        >
            <span
                className={"text-xl font-semibold"}
            >{title}</span>
        </Link>
    )
}