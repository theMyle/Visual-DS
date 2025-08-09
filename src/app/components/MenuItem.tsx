import Link from "next/link";

type MenuItemProps = {
  icon?: React.ReactNode;
  title: string;
  path: string;
};

export default function MenuItem({ icon, title, path }: MenuItemProps) {
  return (
    <Link
      href={path}
      className={
        "flex items-center gap-4 w-full border-[1.5px] border-[#94A6FF] rounded-2xl px-5 py-4 " +
        "bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-all " +
        "duration-150 ease-in-out active:translate-y-[2px] active:shadow-none"
      }
    >
      {icon && <span className="text-[#5168DA] text-2xl">{icon}</span>}
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </Link>
  );
}
