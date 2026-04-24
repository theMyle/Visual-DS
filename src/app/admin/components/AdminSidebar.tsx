"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
}

const NavItem = ({ href, label, icon, active }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
      active
        ? "bg-indigo-50 text-indigo-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <span className={cn(
        "transition-colors duration-200",
        active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
    )}>
      {icon}
    </span>
    {label}
  </Link>
);

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      )
    },
    {
      href: "/admin/assessment",
      label: "Assessment",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      )
    },
    {
      href: "/admin/simulator",
      label: "Simulator",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
      )
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-[ 4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-indigo-600">
          Admin Panel
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Management Console</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-50">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-slate-600 font-medium">Backend Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
