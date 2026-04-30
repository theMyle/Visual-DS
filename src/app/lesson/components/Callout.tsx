import React from "react";

type CalloutVariant = "info" | "warning" | "success" | "tip" | "danger";

const styles: Record<CalloutVariant, {
    container: string;
    border: string;
    bg: string;
    text: string;
    icon: React.ReactNode;
    titleColor: string;
}> = {
    info: {
        container: "",
        border: "border-sky-200",
        bg: "bg-sky-50",
        text: "text-sky-900",
        titleColor: "text-sky-700",
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-600" aria-hidden>
                <path fill="currentColor" d="M11 7h2v2h-2V7m0 4h2v6h-2v-6m1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" />
            </svg>
        )
    },
    warning: {
        container: "",
        border: "border-amber-200",
        bg: "bg-amber-50",
        text: "text-amber-900",
        titleColor: "text-amber-700",
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600" aria-hidden>
                <path fill="currentColor" d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" />
            </svg>
        )
    },
    success: {
        container: "",
        border: "border-green-200",
        bg: "bg-green-50",
        text: "text-green-900",
        titleColor: "text-green-700",
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-600" aria-hidden>
                <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
        )
    },
    tip: {
        container: "",
        border: "border-indigo-200",
        bg: "bg-indigo-50",
        text: "text-indigo-900",
        titleColor: "text-indigo-700",
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600" aria-hidden>
                <path fill="currentColor" d="M20 15.31 23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69ZM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm-1-9h2v5h-2V9Zm0 6h2v2h-2v-2Z" />
            </svg>
        )
    },
    danger: {
        container: "",
        border: "border-rose-200",
        bg: "bg-rose-50",
        text: "text-rose-900",
        titleColor: "text-rose-700",
        icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-600" aria-hidden>
                <path fill="currentColor" d="M12 2 1 21h22L12 2Zm0 15a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-1-8h2v6h-2V9Z" />
            </svg>
        )
    }
};

export default function Callout({
    variant = "warning",
    title,
    children,
    className = "",
}: {
    variant?: CalloutVariant;
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const s = styles[variant];
    return (
        <div className={`mt-2 mb-8 rounded-xl border ${s.border} ${s.bg} ${s.text} ${className}`} role="note">
            <div className="flex items-start gap-3 p-4">
                <div className="mt-0.5 shrink-0" aria-hidden>{s.icon}</div>
                <div className="flex-1">
                    {title && <p className={`font-semibold ${s.titleColor} mb-1`}>{title}</p>}
                    <div className="leading-relaxed [&>*:last-child]:mb-0">{children}</div>
                </div>
            </div>
        </div>
    );
}
