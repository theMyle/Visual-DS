'use client';

import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

type CodeEditorPanelProps = {
    code: string;
    output: string[];
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

    const MIN_OUTPUT_HEIGHT = 120;
    const MAX_OUTPUT_RATIO = 0.4; // Keep max at roughly the current/default output height.

    useEffect(() => {
        const body = panelBodyRef.current;
        if (!body) return;

        const maxOutputHeight = Math.floor(body.clientHeight * MAX_OUTPUT_RATIO);
        const minAllowedHeight = Math.min(MIN_OUTPUT_HEIGHT, maxOutputHeight);
        if (outputHeight === null) {
            setOutputHeight(minAllowedHeight);
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
            const maxOutputHeight = Math.floor(bounds.height * MAX_OUTPUT_RATIO);
            const minAllowedHeight = Math.min(MIN_OUTPUT_HEIGHT, maxOutputHeight);
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
        <div className={className ?? "h-[45vh] lg:h-full overflow-hidden flex flex-col bg-gray-900 text-gray-100"}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/95">
                <p className="text-sm font-semibold tracking-wide">{title}</p>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/40 p-1">
                    <button
                        type="button"
                        onClick={onResetArray}
                        disabled={resetArrayDisabled}
                        className="px-3 py-1.5 text-xs rounded-md border border-transparent text-gray-300 hover:text-gray-100 hover:bg-gray-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset Simulator
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={resetDisabled}
                        className="px-3 py-1.5 text-xs rounded-md border border-transparent text-gray-300 hover:text-gray-100 hover:bg-gray-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset Code
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitDisabled}
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-500/70 bg-gray-200 text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="px-4 py-2 border-b border-gray-700 bg-gray-900">
                        <p className="text-xs font-semibold tracking-wide text-gray-300">Output</p>
                    </div>
                    <div className="flex-1 min-h-0 px-4 pt-2 pb-5 overflow-y-auto">
                        <div className="space-y-1 text-xs text-gray-400 font-mono">
                            {output.map((line, idx) => {
                                const renderedLine = typeof line === "string" ? line : String(line);
                                return (
                                    <p
                                        key={`${renderedLine}-${idx}`}
                                        className={renderedLine.startsWith("ERROR:") ? "rounded border border-red-500/40 bg-red-950/60 px-2 py-1 text-red-200" : undefined}
                                    >
                                        {renderedLine}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
