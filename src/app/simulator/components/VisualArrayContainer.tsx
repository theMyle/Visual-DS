'use client';

import { ReactNode } from "react";

type VisualArrayContainerProps = {
    children: ReactNode;
    className?: string;
};

export default function VisualArrayContainer({ children, className }: VisualArrayContainerProps) {
    return (
        <div className={className ?? "flex-1 min-h-0 flex items-center justify-center px-4 md:px-9 py-4"}>
            {children}
        </div>
    );
}
