"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    ),
  },
  {
    href: "/admin/assessment",
    label: "Assessment",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    href: "/admin/simulator",
    label: "Simulator",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    href: "/admin/lesson",
    label: "Lessons",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        <path d="M8 7h6"/><path d="M8 11h8"/>
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="relative flex flex-col bg-white border-r border-slate-200 h-full flex-shrink-0 transition-[width] duration-200 ease-in-out"
      style={{ width: collapsed ? 64 : 224 }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-9 z-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base flex-shrink-0">
          V
        </div>
        <div
          className="overflow-hidden transition-all duration-200 ease-in-out"
          style={{ width: collapsed ? 0 : 140, opacity: collapsed ? 0 : 1 }}
        >
          <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
            Visual<span className="text-indigo-600">DS</span>
          </span>
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.18em] font-semibold whitespace-nowrap">
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
      {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={[
                "flex items-center rounded-xl transition-colors duration-150 overflow-hidden",
                collapsed ? "justify-center px-0 py-2.5 mx-1" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5">{item.icon}</span>
              <span
                className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out"
                style={collapsed ? { maxWidth: 0, opacity: 0 } : { maxWidth: 160, opacity: 1 }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
