"use client";

import {useRef, useState, useEffect} from "react";
import MenuItemButton from "@/app/components/MenuItemButton";
import VisualDSIcon from "@/app/components/VisualDSIcon";
import Link from "next/link";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Detect clicks outside the overlay
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuOpen &&
          overlayRef.current &&
          !overlayRef.current.contains(event.target as Node)
        ) {
          setMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

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
                <div 
                ref={overlayRef}
                className="fixed top-14 z-50 left-0 w-full bg-white">
                    <MenuItemButton
                        text={"Lessons"}
                        href={"/lesson"}
                        onClick={() => {setMenuOpen(false)}} />

                    <MenuItemButton
                        text={"Simulator"}
                        href={"/simulator"}
                        onClick={() => {setMenuOpen(false)}} />

                    <MenuItemButton
                        text={"Assessment"}
                        href={"/assessment"}
                        onClick={() => {setMenuOpen(false)}} />
                </div>
            )}
        </div>
    );
}
