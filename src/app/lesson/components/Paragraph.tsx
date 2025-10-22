import React from "react";

export default function Paragraph({
    children,
    muted = false,
    className = "",
}: {
    children: React.ReactNode;
    muted?: boolean;
    className?: string;
}) {
    return (
        <p className={`${muted ? 'text-slate-600' : 'text-slate-800'} leading-[1.7] md:text-[1.05rem] md:leading-[1.8] ${className}`}>
            {children}
        </p>
    );
}
