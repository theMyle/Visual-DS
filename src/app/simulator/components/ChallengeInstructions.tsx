'use client';

import { useCallback, useEffect, useRef, useState } from "react";

type ChallengeInstructionsProps = {
    title: string;
    description: string;
    completed?: boolean;
    className?: string;
    onHeightChange?: (height: number) => void;
};

const MIN_HEIGHT_PX = 46;
const DEFAULT_HEIGHT_PX = 188;

export default function ChallengeInstructions({
    title,
    description,
    completed = false,
    className,
    onHeightChange,
}: ChallengeInstructionsProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [panelHeight, setPanelHeight] = useState(DEFAULT_HEIGHT_PX);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const descriptionCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const descriptionHostRef = useRef<HTMLDivElement | null>(null);
    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    const badgeLabel = completed ? "Completed" : "In Progress";
    const badgeClassName = completed
        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
        : "border-slate-300 bg-slate-100 text-slate-600";

    // ── Canvas description rendering ─────────────────────
    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        const lines: string[] = [];
        const paragraphs = text.split(/\r?\n/);
        for (const paragraph of paragraphs) {
            const trimmed = paragraph.trim();
            if (!trimmed) { lines.push(""); continue; }
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
            if (currentLine) lines.push(currentLine);
        }
        return lines;
    };

    useEffect(() => {
        const host = descriptionHostRef.current;
        const canvas = descriptionCanvasRef.current;
        if (!host || !canvas) return;

        const render = () => {
            const width = Math.max(1, host.clientWidth);
            const dpr = window.devicePixelRatio || 1;
            const fontPx = window.innerWidth >= 768 ? 13 : 12;
            const lineHeight = window.innerWidth >= 768 ? 21 : 19;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.font = `400 ${fontPx}px system-ui, -apple-system, sans-serif`;
            const lines = wrapText(ctx, description, width);
            const drawHeight = Math.max(lineHeight, lines.length * lineHeight);

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(drawHeight * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${drawHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, drawHeight);
            ctx.font = `400 ${fontPx}px system-ui, -apple-system, sans-serif`;
            ctx.fillStyle = "#374151"; // gray-700 — high contrast on white
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
    }, [description, isCollapsed]);

    // ── Drag-to-resize ────────────────────────────────────
    const updateHeight = useCallback((nextHeight: number) => {
        setPanelHeight(nextHeight);
        onHeightChange?.(nextHeight);
    }, [onHeightChange]);

    const onHandleMouseDown = (e: React.MouseEvent) => {
        if (isCollapsed) return;
        e.preventDefault();
        dragStartY.current = e.clientY;
        dragStartHeight.current = panelHeight;
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => {
            const delta = e.clientY - dragStartY.current;
            const container = containerRef.current;
            if (!container) return;
            const parentHeight = container.parentElement?.clientHeight ?? 600;
            const maxH = Math.floor(parentHeight * 0.65);
            const next = Math.max(MIN_HEIGHT_PX + 32, Math.min(maxH, dragStartHeight.current + delta));
            updateHeight(next);
        };

        const onMouseUp = () => setIsDragging(false);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging, updateHeight]);

    const effectiveHeight = isCollapsed ? MIN_HEIGHT_PX : panelHeight;

    return (
        <div
            ref={containerRef}
            className={className ?? "relative flex flex-col flex-shrink-0"}
            style={{
                height: effectiveHeight,
                transition: isDragging ? "none" : "height 0.2s ease",
                background: "#f8fafc",  /* slate-50 */
                borderBottom: "1px solid #cbd5e1",
                borderLeft: "3px solid #818cf8",  /* indigo-400 accent */
            }}
        >
            {/* ── Header row ─────────────────────────────── */}
            <div className="flex items-center justify-between px-3 py-2.5 gap-3 flex-shrink-0 border-b border-slate-200">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Collapse chevron */}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed((c) => !c)}
                        aria-label={isCollapsed ? "Expand instructions" : "Collapse instructions"}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title={isCollapsed ? "Expand instructions" : "Collapse instructions"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.5 h-3.5 transition-transform duration-200"
                            style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    <h2
                        className="text-[13px] font-semibold text-slate-900 truncate leading-tight select-none"
                        title={title}
                    >
                        {title}
                    </h2>
                </div>

                {/* Status badge */}
                <span className={`inline-flex flex-shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap select-none ${badgeClassName}`}>
                    {badgeLabel}
                </span>
            </div>

            {/* ── Canvas description ─────────────────────── */}
            {!isCollapsed && (
                <div
                    ref={descriptionHostRef}
                    className="flex-1 min-h-0 overflow-y-auto px-4 py-3"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.12) transparent" }}
                >
                    <canvas
                        ref={descriptionCanvasRef}
                        aria-label={description}
                        className="block max-w-full"
                        style={{ userSelect: "none", WebkitUserSelect: "none" }}
                    />
                </div>
            )}

            {/* ── Resize handle ─────────────────────────── */}
            {!isCollapsed && (
                <div
                    onMouseDown={onHandleMouseDown}
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Resize instructions panel"
                    className={`absolute bottom-0 left-0 right-0 h-2.5 flex items-center justify-center cursor-row-resize group z-10 transition-colors ${
                        isDragging ? "bg-indigo-50" : "hover:bg-slate-50"
                    }`}
                    style={{ touchAction: "none" }}
                >
                    <div className={`w-10 h-[3px] rounded-full transition-colors ${
                        isDragging ? "bg-indigo-400" : "bg-slate-200 group-hover:bg-indigo-300"
                    }`} />
                </div>
            )}
        </div>
    );
}
