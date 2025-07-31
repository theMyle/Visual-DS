"use client";

import {useState} from "react";
import MenuItemButton from "@/app/components/MenuItemButton";
import VisualDSIcon from "@/app/components/VisualDSIcon";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    return(
        <div>
            <nav className="sticky top-0 z-50 w-full h-14 flex items-center justify-between pl-4 border-b-[1.8px] bg-white">
                {/* Logo */}
                <Link href={"/"}>
                    <div className="flex items-center space-x-2 text-2xl font-bold">
                        <VisualDSIcon />
                        <span>Visual DS</span>
                    </div>
                </Link>

                {/* Menu */}
                <button
                    className="flex items-center justify-center w-auto h-full px-5 active:bg-gray-100"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Overlay Menu */}
            { menuOpen && (
                <div className="fixed top-14 left-0 w-full bg-white">
                    <MenuItemButton
                        text={"Lessons"}
                        onClick={() => {
                            router.push("/lesson")
                            setMenuOpen(false)
                        }} />

                    <MenuItemButton
                        text={"Playground"}
                        onClick={() => {
                            router.push("/simulator")
                            setMenuOpen(false)
                        }} />

                    <MenuItemButton
                        text={"Assessment"}
                        onClick={() => {
                            router.push("/assessment")
                            setMenuOpen(false)
                        }} />
                </div>
            )}
        </div>
    );
}