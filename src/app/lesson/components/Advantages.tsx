import React from "react";

export default function Advantages({
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
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-600 mt-0.5" aria-hidden>
                        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
                    </svg>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
            )}
            <ul className="list-disc marker:text-green-600 pl-6 space-y-2 text-slate-800">
                {children}
            </ul>
        </section>
    );
}
