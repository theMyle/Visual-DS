import { cn } from "@/app/lib/utils";
import React from "react";

interface TextLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: React.HTMLAttributeAnchorTarget;
    rel?: string;
}

export default function TextLink({
    href,
    children,
    className,
    target,
    rel,
}: TextLinkProps) {
    return (
        <a
            href={href}
            target={target}
            rel={rel}
            className={cn(
                "text-sky-700 underline underline-offset-2 decoration-sky-500/70 transition-colors hover:text-sky-800 hover:decoration-sky-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2",
                className
            )}
        >
            {children}
        </a>
    );
}
