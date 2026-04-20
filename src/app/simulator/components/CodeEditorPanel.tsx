'use client';

import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

type CodeEditorPanelProps = {
    code: string;
    output: string[];
    resultSummaries?: Array<{
        name: string;
        input: string;
        expected: string;
        actual: string;
        passed: boolean | null;
        statusText: string;
    }> | null;
    onCodeChange: (nextCode: string) => void;
    onReset: () => void;
    onResetArray: () => void;
    onSubmit: () => void;
    title?: string;
    resetDisabled?: boolean;
    resetArrayDisabled?: boolean;
    submitDisabled?: boolean;
    className?: string;
};

export default function CodeEditorPanel({
    code,
    output,
    resultSummaries = null,
    onCodeChange,
    onReset,
    onResetArray,
    onSubmit,
    title = "Code Editor",
    resetDisabled = false,
    resetArrayDisabled = false,
    submitDisabled = false,
    className,
}: CodeEditorPanelProps) {
    const panelBodyRef = useRef<HTMLDivElement | null>(null);
    const [outputHeight, setOutputHeight] = useState<number | null>(null);
    const [isResizingOutput, setIsResizingOutput] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"output" | "result">("output");
    const [expandedResultIndexes, setExpandedResultIndexes] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (resultSummaries && resultSummaries.length > 0) {
            setActiveTab("result");
        }
    }, [resultSummaries]);

    useEffect(() => {
        setExpandedResultIndexes(new Set());
    }, [resultSummaries]);

    const toggleResultExpanded = (idx: number) => {
        setExpandedResultIndexes((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) {
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    const getOutputSizing = () => {
        const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;
        return {
            minHeight: isMobileViewport ? 96 : 120,
            maxRatio: isMobileViewport ? 0.34 : 0.4,
        };
    };

    useEffect(() => {
        const body = panelBodyRef.current;
        if (!body) return;

        const { minHeight, maxRatio } = getOutputSizing();
        const maxOutputHeight = Math.floor(body.clientHeight * maxRatio);
        const minAllowedHeight = Math.min(minHeight, maxOutputHeight);
        if (outputHeight === null) {
            setOutputHeight(maxOutputHeight);
            return;
        }

        const clamped = Math.max(minAllowedHeight, Math.min(maxOutputHeight, outputHeight));
        if (clamped !== outputHeight) {
            setOutputHeight(clamped);
        }
    }, [outputHeight]);

    useEffect(() => {
        if (!isResizingOutput) return;

        const onMouseMove = (event: MouseEvent) => {
            const body = panelBodyRef.current;
            if (!body) return;

            const bounds = body.getBoundingClientRect();
            const { minHeight, maxRatio } = getOutputSizing();
            const maxOutputHeight = Math.floor(bounds.height * maxRatio);
            const minAllowedHeight = Math.min(minHeight, maxOutputHeight);
            const nextOutputHeight = bounds.bottom - event.clientY;
            const clampedHeight = Math.max(minAllowedHeight, Math.min(maxOutputHeight, nextOutputHeight));
            setOutputHeight(clampedHeight);
        };

        const onMouseUp = () => setIsResizingOutput(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isResizingOutput]);

    return (
        <div className={className ?? "h-[56vh] lg:h-full overflow-hidden flex flex-col bg-gray-900 text-gray-100"}>
            <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-700 bg-gray-900/95">
                <p className="text-xs md:text-sm font-semibold tracking-wide">{title}</p>
                <div className="flex items-center gap-1.5 md:gap-2 rounded-lg border border-gray-700 bg-gray-800/40 p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("output");
                            onResetArray();
                        }}
                        disabled={resetArrayDisabled}
                        className="px-2.5 md:px-3 py-1 text-[10px] md:text-xs rounded-md border border-transparent text-gray-300 hover:text-gray-100 hover:bg-gray-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset Simulator
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={resetDisabled}
                        className="px-2.5 md:px-3 py-1 text-[10px] md:text-xs rounded-md border border-transparent text-gray-300 hover:text-gray-100 hover:bg-gray-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset Code
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitDisabled}
                        className="px-2.5 md:px-3 py-1 text-[10px] md:text-xs rounded-md border border-gray-500/70 bg-gray-200 text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit
                    </button>
                </div>
            </div>

            <div ref={panelBodyRef} className="flex-1 min-h-0 flex flex-col">
                <div className="min-h-0 overflow-y-auto flex-1">
                    <CodeMirror
                        value={code}
                        height="auto"
                        extensions={[javascript()]}
                        onChange={onCodeChange}
                        theme="dark"
                        style={{ minHeight: "100%" }}
                        basicSetup={{
                            lineNumbers: true,
                            highlightActiveLine: true,
                            foldGutter: true,
                            autocompletion: true,
                        }}
                    />
                </div>

                <div
                    className="h-2 shrink-0 cursor-row-resize bg-gray-800 hover:bg-blue-900/60 transition-colors"
                    onMouseDown={() => setIsResizingOutput(true)}
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Resize output panel"
                >
                    <div className="mx-auto mt-[3px] h-[2px] w-10 rounded bg-gray-500" />
                </div>

                <div
                    className="min-h-0 border-t border-gray-700 flex flex-col"
                    style={outputHeight ? { height: `${outputHeight}px` } : undefined}
                >
                    <div className="px-3 md:px-4 py-2 border-b border-gray-700 bg-gray-900">
                        <div className="inline-flex rounded-md border border-gray-700 bg-gray-800/60 p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab("output")}
                                className={`px-2.5 py-1 text-[11px] md:text-xs rounded ${activeTab === "output"
                                    ? "bg-cyan-800/80 text-cyan-100"
                                    : "text-gray-300 hover:text-gray-100"
                                    }`}
                            >
                                Console
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("result")}
                                className={`px-2.5 py-1 text-[11px] md:text-xs rounded ${activeTab === "result"
                                    ? "bg-emerald-800/80 text-emerald-100"
                                    : "text-gray-300 hover:text-gray-100"
                                    }`}
                            >
                                Result
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 px-3 md:px-4 pt-2 pb-5 overflow-y-auto">
                        {activeTab === "output" ? (
                            <div className="space-y-1 text-[10px] md:text-xs text-gray-400 font-mono">
                                {output.map((line, idx) => {
                                    const renderedLine = typeof line === "string" ? line : String(line);
                                    const isError = renderedLine.startsWith("ERROR:");

                                    return (
                                        <p
                                            key={`${renderedLine}-${idx}`}
                                            className={isError ? "rounded border border-red-500/40 bg-red-950/60 px-2 py-1 text-red-200" : undefined}
                                        >
                                            {renderedLine}
                                        </p>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {!resultSummaries || resultSummaries.length === 0 ? (
                                    <p className="text-xs md:text-sm font-normal font-sans text-gray-400">Submit your solution to see challenge results here.</p>
                                ) : (
                                    resultSummaries.map((resultSummary, idx) => (
                                        <div
                                            key={`${resultSummary.name}-${idx}`}
                                            className="rounded-lg border border-gray-700 bg-gray-900/70 p-3 md:p-4 text-[11px] md:text-xs font-mono"
                                        >
                                            <div className="space-y-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleResultExpanded(idx)}
                                                    className="w-full flex items-center justify-between gap-3 text-left"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-gray-400">{expandedResultIndexes.has(idx) ? "▾" : "▸"}</span>
                                                        <p className="text-gray-100 font-semibold break-all">{resultSummary.name}</p>
                                                    </div>
                                                    <span
                                                        className={resultSummary.passed === true
                                                            ? "shrink-0 rounded-full border border-emerald-500/50 bg-emerald-950/70 px-2 py-0.5 text-[10px] md:text-xs font-semibold text-emerald-200"
                                                            : resultSummary.passed === false
                                                                ? "shrink-0 rounded-full border border-rose-500/50 bg-rose-950/70 px-2 py-0.5 text-[10px] md:text-xs font-semibold text-rose-200"
                                                                : "shrink-0 rounded-full border border-yellow-500/50 bg-yellow-950/70 px-2 py-0.5 text-[10px] md:text-xs font-semibold text-yellow-200"
                                                        }
                                                    >
                                                        {resultSummary.passed === true
                                                            ? "✓ PASS"
                                                            : resultSummary.passed === false
                                                                ? "✗ FAIL"
                                                                : "- PENDING"}
                                                    </span>
                                                </button>

                                                {expandedResultIndexes.has(idx) && (
                                                    <div className="space-y-2 pt-1">
                                                        <p><span className="text-gray-400">Input:</span> <span className="text-gray-100 break-all">{resultSummary.input}</span></p>
                                                        <p><span className="text-gray-400">Expected:</span> <span className="text-gray-100 break-all">{resultSummary.expected}</span></p>
                                                        <p><span className="text-gray-400">Actual:</span> <span className="text-gray-100 break-all">{resultSummary.actual}</span></p>
                                                        <p>
                                                            <span className="text-gray-400">Status:</span>{" "}
                                                            <span className={resultSummary.passed === true
                                                                ? "text-emerald-300"
                                                                : resultSummary.passed === false
                                                                    ? "text-rose-300"
                                                                    : "text-yellow-300"
                                                            }>
                                                                {resultSummary.statusText}
                                                            </span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
