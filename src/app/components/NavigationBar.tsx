"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuItemButton from "@/app/components/MenuItemButton";
import VisualDSIcon from "@/app/components/VisualDSIcon";
import Link from "next/link";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

    // Detect clicks outside the overlay
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuOpen &&
                overlayRef.current &&
                hamburgerButtonRef.current &&
                !overlayRef.current.contains(event.target as Node) &&
                !hamburgerButtonRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (
        <div>
            <nav className="sticky top-0 z-50 w-full h-14 flex items-center justify-between pl-4 border-b-[1.8px] border-gray-300 bg-white">
                {/* Logo */}
                <Link href={"/"}>
                    <div className="flex items-center space-x-2 text-2xl font-bold">
                        <VisualDSIcon />
                        <span>Visual DS</span>
                    </div>
                </Link>

                {/* Menu */}
                <button
                    ref={hamburgerButtonRef}
                    className="flex items-center justify-center w-auto h-full px-5 active:bg-gray-100"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Overlay Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        ref={overlayRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        className="fixed top-14 z-50 left-0 w-full md:left-auto md:right-0 md:w-80 md:bottom-0 bg-white border-l border-gray-300 md:border-l-2 shadow-lg md:shadow-xl"
                    >
                        <div className="md:overflow-y-auto md:h-full">
                            <MenuItemButton
                                text={"Home"}
                                href={"/"}
                                onClick={() => { setMenuOpen(false) }} />

                            <MenuItemButton
                                text={"Lessons"}
                                href={"/lesson"}
                                onClick={() => { setMenuOpen(false) }} />

                            <MenuItemButton
                                text={"Simulator"}
                                href={"/simulator"}
                                onClick={() => { setMenuOpen(false) }} />

                            <MenuItemButton
                                text={"Assessment"}
                                href={"/assessment"}
                                onClick={() => { setMenuOpen(false) }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
