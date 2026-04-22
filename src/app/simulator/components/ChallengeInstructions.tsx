'use client';

import { useEffect, useRef, useState } from "react";

type ChallengeInstructionsProps = {
    title: string;
    description: string;
    completed?: boolean;
    className?: string;
};

export default function ChallengeInstructions({
    title,
    description,
    completed = false,
    className,
}: ChallengeInstructionsProps) {
    const titleCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const titleHostRef = useRef<HTMLDivElement | null>(null);
    const descriptionCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const descriptionHostRef = useRef<HTMLDivElement | null>(null);
    const [descriptionCanvasHeight, setDescriptionCanvasHeight] = useState<number>(24);

    const badgeLabel = completed ? "Completed" : "In Progress";
    const badgeClassName = completed
        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
        : "border-slate-300 bg-slate-100 text-slate-600";

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        const lines: string[] = [];
        const paragraphs = text.split(/\r?\n/);

        for (const paragraph of paragraphs) {
            const trimmed = paragraph.trim();
            if (!trimmed) {
                lines.push("");
                continue;
            }

            const words = trimmed.split(/\s+/);
            let currentLine = "";

            for (const word of words) {
                const candidate = currentLine ? `${currentLine} ${word}` : word;
                if (ctx.measureText(candidate).width <= maxWidth || !currentLine) {
                    currentLine = candidate;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }
        }

        return lines;
    };

    useEffect(() => {
        const host = titleHostRef.current;
        const canvas = titleCanvasRef.current;
        if (!host || !canvas) return;

        const render = () => {
            const width = Math.max(1, host.clientWidth);
            const dpr = window.devicePixelRatio || 1;
            const fontPx = window.innerWidth >= 768 ? 18 : 14;
            const lineHeight = window.innerWidth >= 768 ? 24 : 20;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.font = `600 ${fontPx}px sans-serif`;
            const wrapped = wrapText(ctx, title, width);
            const lines = wrapped.slice(0, 2);

            if (wrapped.length > 2 && lines.length > 0) {
                const lastIndex = lines.length - 1;
                let lastLine = lines[lastIndex];
                while (ctx.measureText(`${lastLine}...`).width > width && lastLine.length > 0) {
                    lastLine = lastLine.slice(0, -1);
                }
                lines[lastIndex] = `${lastLine}...`;
            }

            const drawHeight = Math.max(lineHeight, lines.length * lineHeight);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(drawHeight * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${drawHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, drawHeight);
            ctx.font = `600 ${fontPx}px sans-serif`;
            ctx.fillStyle = "#1e293b";
            ctx.textBaseline = "top";

            lines.forEach((line, index) => {
                ctx.fillText(line, 0, index * lineHeight);
            });
        };

        render();

        const observer = new ResizeObserver(() => render());
        observer.observe(host);
        window.addEventListener("resize", render);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", render);
        };
    }, [title]);

    useEffect(() => {
        const host = descriptionHostRef.current;
        const canvas = descriptionCanvasRef.current;
        if (!host || !canvas) return;

        const render = () => {
            const width = Math.max(1, host.clientWidth);
            const dpr = window.devicePixelRatio || 1;
            const fontPx = window.innerWidth >= 768 ? 14 : 12;
            const lineHeight = window.innerWidth >= 768 ? 22 : 20;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.font = `400 ${fontPx}px sans-serif`;
            const lines = wrapText(ctx, description, width);
            const drawHeight = Math.max(lineHeight, lines.length * lineHeight);

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(drawHeight * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${drawHeight}px`;
            setDescriptionCanvasHeight(drawHeight);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, drawHeight);
            ctx.font = `400 ${fontPx}px sans-serif`;
            ctx.fillStyle = "#475569";
            ctx.textBaseline = "top";

            lines.forEach((line, index) => {
                ctx.fillText(line, 0, index * lineHeight);
            });
        };

        render();

        const observer = new ResizeObserver(() => render());
        observer.observe(host);
        window.addEventListener("resize", render);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", render);
        };
    }, [description]);

    return (
        <div className={className ?? "border-b border-gray-200 bg-slate-50/90"}>
            <div className="px-3 md:px-6 py-3 md:py-5 h-32 md:h-40 flex flex-col">
                <div className="flex justify-between gap-2 md:gap-3 pb-2 border-b border-slate-200/80">
                    <div ref={titleHostRef} className="my-0 self-center flex-1 min-w-0">
                        <canvas
                            ref={titleCanvasRef}
                            aria-label={title}
                            className="block max-w-full select-none"
                        />
                    </div>
                    <span className={`inline-flex self-center items-center rounded-full border px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-semibold whitespace-nowrap ${badgeClassName}`}>
                        {badgeLabel}
                    </span>
                </div>

                <div ref={descriptionHostRef} className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
                    <canvas
                        ref={descriptionCanvasRef}
                        aria-label={description}
                        className="block max-w-full select-none"
                        style={{ minHeight: descriptionCanvasHeight }}
                    />
                </div>
            </div>
        </div>
    );
}
