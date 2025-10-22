import React from "react";

export default function Drawbacks({
    title,
    children,
    className = "",
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={`mt-2 ${className}`}>
            {title && (
                <div className="flex items-start gap-2 mb-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-orange-600 mt-0.5" aria-hidden>
                        <path fill="currentColor" d="M12 2 1 21h22L12 2Zm0 15a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-1-8h2v6h-2V9Z" />
                    </svg>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
            )}
            <ul className="list-disc marker:text-orange-600 pl-6 space-y-2 text-slate-800">
                {children}
            </ul>
        </section>
    );
}
