'use client';

import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import SimulatorQuickHelpModal from "@/app/simulator/components/SimulatorQuickHelpModal";

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
    submissions?: Array<{
        id: string;
        code: string;
        created_at: string;
        status: string;
    }> | null;
    onCodeChange: (nextCode: string) => void;
    onRestoreSolution?: (code: string) => void;
    onReset: () => void;
    onResetArray: () => void;
    onSubmit: () => void;
    onNext?: () => void;
    showNextButton?: boolean;
    title?: string;
    resetDisabled?: boolean;
    resetArrayDisabled?: boolean;
    submitDisabled?: boolean;
    nextDisabled?: boolean;
    className?: string;
};

export default function CodeEditorPanel({
    code,
    output,
    resultSummaries = null,
    submissions = null,
    onCodeChange,
    onRestoreSolution,
    onReset,
    onResetArray,
    onSubmit,
    onNext,
    showNextButton = false,
    title = "Code Editor",
    resetDisabled = false,
    resetArrayDisabled = false,
    submitDisabled = false,
    nextDisabled = false,
    className,
}: CodeEditorPanelProps) {
    const panelBodyRef = useRef<HTMLDivElement | null>(null);
    const [outputHeight, setOutputHeight] = useState<number | null>(null);
    const [isResizingOutput, setIsResizingOutput] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"output" | "result" | "solutions">("output");
    const [expandedResultIndexes, setExpandedResultIndexes] = useState<Set<number>>(new Set());
    const [expandedSolutionIds, setExpandedSolutionIds] = useState<Set<string>>(new Set());
    const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
    const [isOutputCollapsed, setIsOutputCollapsed] = useState<boolean>(false);
    const collapsedOutputHeight = 42;

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

    const toggleSolutionExpanded = (id: string) => {
        const newSet = new Set(expandedSolutionIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedSolutionIds(newSet);
    };

    useEffect(() => {
        if (resultSummaries && resultSummaries.length > 0) {
            setActiveTab("result");
            setIsOutputCollapsed(false);

            const body = panelBodyRef.current;
            if (!body) {
                return;
            }

            const { maxRatio } = getOutputSizing();
            const maxOutputHeight = Math.floor(body.clientHeight * maxRatio);
            // Auto-expand to a balanced height (about half of max) on new results
            setOutputHeight((currentHeight) => {
                const targetHeight = Math.floor(maxOutputHeight * 0.6);
                if (currentHeight === null || currentHeight < targetHeight) {
                    return targetHeight;
                }
                return currentHeight;
            });
        }
    }, [resultSummaries]);

    useEffect(() => {
        setExpandedResultIndexes(new Set());
    }, [resultSummaries]);

    const getOutputSizing = () => {
        const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;
        return {
            minRatio: 0.15,
            maxRatio: 0.75,
        };
    };

    useEffect(() => {
        const body = panelBodyRef.current;
        if (!body) return;

        const { maxRatio, minRatio } = getOutputSizing();
        const maxOutputHeight = Math.floor(body.clientHeight * maxRatio);
        const minOutputHeight = Math.floor(body.clientHeight * minRatio);
        if (outputHeight === null) {
            setOutputHeight(minOutputHeight);
            return;
        }

        const clamped = Math.max(0, Math.min(maxOutputHeight, outputHeight));
        if (clamped !== outputHeight) {
            setOutputHeight(clamped);
        }
    }, [outputHeight]);

    // Set initial height to a balanced level on first load
    useEffect(() => {
        const body = panelBodyRef.current;
        if (body && outputHeight === null) {
            setOutputHeight(Math.floor(body.clientHeight * 0.45));
        }
    }, [outputHeight]);

    useEffect(() => {
        if (!isResizingOutput) return;

        const onMouseMove = (event: MouseEvent) => {
            const body = panelBodyRef.current;
            if (!body) return;

            const bounds = body.getBoundingClientRect();
            const { maxRatio, minRatio } = getOutputSizing();
            const maxOutputHeight = Math.floor(bounds.height * maxRatio);
            const minOutputHeight = Math.floor(bounds.height * minRatio);
            const nextOutputHeight = bounds.bottom - event.clientY;
            const clampedHeight = Math.max(minOutputHeight, Math.min(maxOutputHeight, nextOutputHeight));
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
        <div className={className ?? "h-[56vh] lg:h-full overflow-hidden flex flex-col bg-[#0f1117] text-gray-100"}>
            <SimulatorQuickHelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />

            {/* Toolbar */}
            <div 
                className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-white/[0.06] flex-shrink-0 shadow-sm"
                style={{ background: "linear-gradient(to right, #141820, #111520)" }}
            >
                {/* Left: label + help */}
                <div className="flex items-center gap-2">
                    {/* Terminal icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" y1="19" x2="20" y2="19" />
                    </svg>
                    <p className="text-[11px] md:text-xs font-semibold tracking-wider text-slate-300 uppercase">{title}</p>
                    <button
                        type="button"
                        onClick={() => setIsHelpOpen(true)}
                        title="Help"
                        aria-label="Open help"
                        className="ml-1 h-5 w-5 md:h-5.5 md:w-5.5 rounded-full border border-slate-600 bg-slate-800 text-[10px] font-bold text-slate-400 hover:border-indigo-500 hover:text-indigo-300 transition-colors"
                    >
                        ?
                    </button>
                </div>

                {/* Right: action buttons */}
                <div className="flex items-center gap-1.5">
                    {/* Reset group */}
                    <div className="flex items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.04] p-0.5">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab("output");
                                onResetArray();
                            }}
                            disabled={resetArrayDisabled}
                            title="Reset the visualizer and clear output"
                            className="px-2 md:px-2.5 py-1 text-[10px] md:text-[11px] rounded font-medium text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Reset Sim
                        </button>
                        <div className="w-px h-3.5 bg-white/10" />
                        <button
                            type="button"
                            onClick={onReset}
                            disabled={resetDisabled}
                            title="Restore the starter code template"
                            className="px-2 md:px-2.5 py-1 text-[10px] md:text-[11px] rounded font-medium text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Reset Code
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitDisabled}
                        title="Run your solution against test cases"
                        className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-[10px] md:text-[11px] rounded-md font-semibold bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-500/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-indigo-900/50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Submit
                    </button>

                    {/* Next (conditional) */}
                    {showNextButton && (
                        <button
                            type="button"
                            onClick={onNext}
                            disabled={nextDisabled}
                            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-[10px] md:text-[11px] rounded-md font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 border border-emerald-500/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-emerald-900/50"
                        >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div ref={panelBodyRef} className="flex-1 min-h-0 flex flex-col">
                <div className="scrollbar-dark min-h-0 overflow-y-auto flex-1">
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
                    className={`h-3 shrink-0 cursor-row-resize flex items-center justify-center transition-colors group ${
                        isResizingOutput ? "bg-indigo-600/30" : "bg-[#0f1117] hover:bg-indigo-600/20"
                    }`}
                    onMouseDown={() => setIsResizingOutput(true)}
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Resize output panel"
                >
                    <div className={`h-[3px] w-12 rounded-full transition-colors ${
                        isResizingOutput ? "bg-indigo-400" : "bg-white/15 group-hover:bg-indigo-400/70"
                    }`} />
                </div>

                <div
                    className="border-t border-white/[0.06] flex flex-col overflow-hidden"
                    style={{ height: `${isOutputCollapsed ? collapsedOutputHeight : outputHeight ?? (typeof window !== 'undefined' && window.innerHeight * 0.4 || 350)}px`, background: "#0c0f18" }}
                >
                    <div className="px-3 md:px-4 py-2 border-b border-white/[0.06]" style={{ background: "#0c0f18" }}>
                        <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex rounded-md border border-gray-700 bg-gray-800/60 p-0.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("output");
                                        setIsOutputCollapsed(false);
                                    }}
                                    className={`px-2.5 py-1 text-[11px] md:text-xs rounded ${activeTab === "output"
                                        ? "bg-cyan-800/80 text-cyan-100"
                                        : "text-gray-300 hover:text-gray-100"
                                        }`}
                                >
                                    Console
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("result");
                                        setIsOutputCollapsed(false);
                                    }}
                                    className={`px-2.5 py-1 text-[11px] md:text-xs rounded ${activeTab === "result"
                                        ? "bg-emerald-800/80 text-emerald-100"
                                        : "text-gray-300 hover:text-gray-100"
                                        }`}
                                >
                                    Result
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("solutions");
                                        setIsOutputCollapsed(false);
                                    }}
                                    className={`px-2.5 py-1 text-[11px] md:text-xs rounded ${activeTab === "solutions"
                                        ? "bg-indigo-800/80 text-indigo-100"
                                        : "text-gray-300 hover:text-gray-100"
                                        }`}
                                >
                                    Solutions
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const nextState = !isOutputCollapsed;
                                    setIsOutputCollapsed(nextState);
                                    if (!nextState && outputHeight === null) {
                                        const body = panelBodyRef.current;
                                        if (body) {
                                            setOutputHeight(Math.floor(body.clientHeight * 0.45));
                                        }
                                    }
                                }}
                                title={isOutputCollapsed ? "Expand" : "Collapse"}
                                aria-label={isOutputCollapsed ? "Expand output panel" : "Collapse output panel"}
                                className="h-7 w-7 rounded-md border border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 transition-colors flex items-center justify-center text-xs"
                            >
                                {isOutputCollapsed ? "▴" : "▾"}
                            </button>
                        </div>
                    </div>

                    {!isOutputCollapsed && (
                        <div className="flex-1 min-h-0 px-3 md:px-4 pt-2 pb-5 overflow-y-auto scrollbar-dark">
                            {activeTab === "output" ? (
                                <div className="space-y-1 text-[11px] md:text-xs text-gray-400 font-mono">
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
                            ) : activeTab === "result" ? (
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
                                                                    : "– PENDING"}
                                                        </span>
                                                    </button>

                                                    {expandedResultIndexes.has(idx) && (
                                                        <div className="space-y-2 pt-1 border-t border-gray-700/50 mt-2">
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
                            ) : (
                                <div className="space-y-3">
                                    {!submissions || submissions.length === 0 ? (
                                        <div className="py-6 text-center">
                                            <p className="text-xs md:text-sm font-normal font-sans text-gray-400">No previous solutions found for this challenge.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2 max-w-3xl">
                                            {submissions.map((sub) => {
                                                const isExpanded = expandedSolutionIds.has(sub.id);
                                                return (
                                                    <div
                                                        key={sub.id}
                                                        className="flex flex-col gap-2 p-3 rounded-lg border border-gray-700 bg-gray-900/40 hover:bg-gray-900/60 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => onRestoreSolution?.(sub.code)}
                                                                className="px-3 py-1.5 text-[10px] md:text-[11px] font-bold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95 shrink-0"
                                                            >
                                                                Restore
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleSolutionExpanded(sub.id)}
                                                                className="flex flex-col text-left hover:opacity-80 transition-opacity min-w-0"
                                                            >
                                                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight flex items-center gap-1">
                                                                    <span className="text-gray-600">{isExpanded ? "▾" : "▸"}</span>
                                                                    {new Date(sub.created_at).toLocaleString()}
                                                                </span>
                                                                <span className="text-[11px] font-medium text-emerald-400">
                                                                    Successful Submission
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div className="relative">
                                                            <pre className={`text-[10px] font-mono text-gray-400 bg-black/30 p-2 rounded border border-white/[0.03] overflow-x-auto scrollbar-dark transition-all duration-200 ${isExpanded ? "max-h-[400px]" : "max-h-24"}`}>
                                                                {isExpanded ? sub.code : (sub.code.length > 300 ? sub.code.slice(0, 300) + '...' : sub.code)}
                                                            </pre>
                                                            {!isExpanded && sub.code.length > 300 && (
                                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
