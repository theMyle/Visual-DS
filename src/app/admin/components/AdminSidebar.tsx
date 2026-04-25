"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ href, label, icon, active, isCollapsed }: NavItemProps) => (
  <Link
    href={href}
    title={isCollapsed ? label : ""}
    className={cn(
      "flex items-center transition-all duration-300 rounded-xl group relative overflow-hidden",
      isCollapsed ? "justify-center h-12 w-12 px-0 mx-auto" : "gap-3 px-4 py-3 h-auto w-full",
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <motion.span 
      layout
      className={cn(
        "flex-shrink-0 transition-colors duration-300",
        active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
      )}
    >
      {icon}
    </motion.span>
    
    <AnimatePresence mode="wait">
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="font-semibold text-sm whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {active && isCollapsed && (
      <motion.div 
        layoutId="active-pill"
        className="absolute left-0 w-1 h-6 bg-white rounded-full" 
      />
    )}
  </Link>
);

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
      )
    },
    {
      href: "/admin/assessment",
      label: "Assessment",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
      )
    },
    {
      href: "/admin/simulator",
      label: "Simulator",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" /></svg>
      )
    }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white border-r border-slate-200 flex flex-col h-full relative group/sidebar"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all z-20"
      >
        <motion.svg
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          xmlns="http://www.w3.org/2000/svg"
          width="14" height="14"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </motion.svg>
      </button>

      {/* Header */}
      <div className={cn(
        "p-6 border-b border-slate-50 flex flex-col",
        isCollapsed ? "items-center px-2" : "items-start px-6"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg shadow-indigo-100">
            V
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h2 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-bold text-slate-900 whitespace-nowrap overflow-hidden"
              >
                Visual<span className="text-indigo-600">DS</span>
              </motion.h2>
            )}
          </AnimatePresence>
        </div>
        {!isCollapsed && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold"
          >
            Admin Console
          </motion.p>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 flex flex-col gap-2 mt-4",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </motion.aside>
  );
}


