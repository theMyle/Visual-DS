// Buttons for hamburger menu

import React from "react";
import Link from "next/link";

type MenuItemButtonProps = {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  href: string;
};

export default function MenuItemButton({ icon, text, onClick, href }: MenuItemButtonProps) {
  return (
    <div
      onClick={onClick}
      className={"w-full"}
    >
      <Link
        href={href}
        className="w-full flex items-center text-left gap-2 bg-gray-100 border-b-[1.5px] border-gray-300 py-3 px-6
            hover:bg-gray-200 active:bg-gray-300"
      >
        {icon}
        <span className="text-xl">{text}</span>
      </Link>
    </div>
  );
}
