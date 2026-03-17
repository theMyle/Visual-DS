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
        "flex w-full items-center justify-between gap-4 border-[1.5px] border-gray-300 rounded-lg px-4 py-3.5 bg-white"
      }
      style={{ boxShadow: "0 4px 20px rgba(116, 143, 252, 0.08)" }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 pr-2">
        {icon && <span className="text-2xl text-[#5168DA]">{icon}</span>}

        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold text-gray-900 leading-tight break-words">{title}</p>
        </div>
      </div>

      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#C9D3FF] bg-[#EEF1FF] text-[#5C70D6]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
