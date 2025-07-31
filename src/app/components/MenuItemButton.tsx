
import React from "react";
// Buttons for toggle menu

type MenuItemButtonProps = {
    icon?: React.ReactNode;
    text: string;
    onClick?: () => void;
};

export default function MenuItemButton({icon, text, onClick}: MenuItemButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center text-left gap-2 bg-gray-100 border-b-[1.5px] py-3 px-6
            hover:bg-gray-200 active:bg-gray-300"
        >
            {icon}
            <span className="text-xl">{text}</span>
        </button>
    );
}