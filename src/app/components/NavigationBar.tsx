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
            <nav className="sticky top-0 z-50 w-full h-14 flex items-center justify-between pl-4 pr-4 border-b-[1.8px] border-gray-300 bg-white">
                {/* Logo */}
                <Link href={"/"}>
                    <div className="flex items-center space-x-2 text-2xl font-bold">
                        <VisualDSIcon />
                        <span>Visual DS</span>
                    </div>
                </Link>

                {/* Desktop Navigation - visible on md and up */}
                <div className="hidden md:flex items-center space-x-1">
                    <Link href="/" className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-medium active:transform active:scale-95">
                        Home
                    </Link>
                    <Link href="/lesson" className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-medium active:transform active:scale-95">
                        Lesson
                    </Link>
                    <Link href="/simulator" className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-medium active:transform active:scale-95">
                        Simulator
                    </Link>
                    <Link href="/assessment" className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-medium active:transform active:scale-95">
                        Assessment
                    </Link>
                </div>

                {/* Mobile Hamburger Menu - visible on mobile only */}
                <button
                    ref={hamburgerButtonRef}
                    className="md:hidden flex items-center justify-center w-auto h-full px-5 active:bg-gray-100"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Mobile Overlay Menu - only on mobile */}
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
                        className="md:hidden fixed top-14 z-50 left-0 w-full bg-white border-l border-gray-300 shadow-lg"
                    >
                        <div className="overflow-y-auto">
                            <MenuItemButton
                                text={"Home"}
                                href={"/"}
                                onClick={() => { setMenuOpen(false) }} />

                            <MenuItemButton
                                text={"Lesson"}
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
