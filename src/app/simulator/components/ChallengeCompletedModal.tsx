'use client';

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Howl } from "howler";

type ChallengeCompletedModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onMenu: () => void;
    onNext: () => void;
    testCaseLabels: string[];
};

let successHowl: Howl | null = null;
let cachedSuccessSoundDataUri: string | null = null;

const buildSuccessSoundDataUri = () => {
    if (cachedSuccessSoundDataUri) return cachedSuccessSoundDataUri;

    const sampleRate = 44100;
    const durationSec = 0.62;
    const totalSamples = Math.floor(sampleRate * durationSec);
    const pcm = new Int16Array(totalSamples);

    // Warm major reward stack with lower emphasis to avoid overly bright highs.
    const notes = [392.0, 493.88, 587.33];
    const noteStarts = [0.0, 0.085, 0.17];

    for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;

        let noteIndex = 0;
        if (t >= noteStarts[2]) noteIndex = 2;
        else if (t >= noteStarts[1]) noteIndex = 1;

        const f = notes[noteIndex];
        const localT = t - noteStarts[noteIndex];

        const attack = Math.min(1, localT / 0.024);
        const decay = Math.exp(-localT * 6.2);
        const body = attack * decay;
        const globalTail = Math.exp(-t * 1.45);

        const fundamental = Math.sin(2 * Math.PI * f * t);
        const softHarmonic = 0.2 * Math.sin(2 * Math.PI * f * 2 * t + 0.08);
        const warmth = 0.13 * Math.sin(2 * Math.PI * (f * 0.5) * t + 0.2);

        let sample = (fundamental + softHarmonic + warmth) * body * globalTail;

        // Gentle low-mid bloom to make it feel like a reward instead of a beep.
        const bloom = 0.08 * Math.sin(2 * Math.PI * 196 * t) * Math.exp(-t * 3.8);
        sample += bloom;

        // Extra fade near the tail so the end is smooth.
        const tailFadeStart = durationSec - 0.12;
        if (t > tailFadeStart) {
            const tailProgress = (t - tailFadeStart) / 0.12;
            sample *= Math.max(0, 1 - tailProgress * tailProgress);
        }

        sample = Math.max(-1, Math.min(1, sample * 0.64));

        pcm[i] = Math.round(sample * 32767);
    }

    const byteRate = sampleRate * 2;
    const blockAlign = 2;
    const dataSize = pcm.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeString = (offset: number, value: string) => {
        for (let i = 0; i < value.length; i++) {
            view.setUint8(offset + i, value.charCodeAt(i));
        }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < pcm.length; i++) {
        view.setInt16(offset, pcm[i], true);
        offset += 2;
    }

    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    cachedSuccessSoundDataUri = `data:audio/wav;base64,${btoa(binary)}`;
    return cachedSuccessSoundDataUri;
};

const playSuccessSound = () => {
    if (typeof window === "undefined") return;

    try {
        if (!successHowl) {
            successHowl = new Howl({
                src: [buildSuccessSoundDataUri()],
                volume: 0.38,
                preload: true,
            });
        }

        if (successHowl.playing()) {
            successHowl.stop();
        }

        successHowl.play();
    } catch {
        // Ignore audio failures.
    }
};

const ensureSuccessSoundReady = () => {
    if (typeof window === "undefined") return;

    try {
        if (!successHowl) {
            successHowl = new Howl({
                src: [buildSuccessSoundDataUri()],
                volume: 0.38,
                preload: true,
            });
        }

        // Prime audio decoding earlier so playback can start immediately.
        successHowl.load();
    } catch {
        // Ignore audio failures.
    }
};

const playSuccessCelebration = async () => {
    if (typeof window === "undefined") return;

    // Trigger sound first so it starts in sync with modal appearance.
    playSuccessSound();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
        confetti({
            particleCount: 140,
            spread: 110,
            startVelocity: 45,
            ticks: 220,
            scalar: 1.05,
            zIndex: 1200,
            origin: { x: 0.5, y: 0.45 },
            colors: ["#10b981", "#14b8a6", "#22c55e", "#f59e0b", "#3b82f6"],
        });

        // Add side bursts so the celebration fills the whole screen.
        confetti({
            particleCount: 70,
            angle: 60,
            spread: 70,
            startVelocity: 42,
            ticks: 200,
            zIndex: 1200,
            origin: { x: 0.02, y: 0.62 },
            colors: ["#10b981", "#14b8a6", "#22c55e", "#f59e0b", "#3b82f6"],
        });

        confetti({
            particleCount: 70,
            angle: 120,
            spread: 70,
            startVelocity: 42,
            ticks: 200,
            zIndex: 1200,
            origin: { x: 0.98, y: 0.62 },
            colors: ["#10b981", "#14b8a6", "#22c55e", "#f59e0b", "#3b82f6"],
        });
    }

};

export default function ChallengeCompletedModal({
    isOpen,
    onClose,
    onMenu,
    onNext,
    testCaseLabels,
}: ChallengeCompletedModalProps) {
    useEffect(() => {
        ensureSuccessSoundReady();
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        void playSuccessCelebration();
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[1000] bg-slate-950/60 p-4 md:p-6"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                >
                    <motion.div
                        className="mx-auto mt-[8vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Challenge completed"
                        onClick={(event) => event.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 md:px-6 md:py-6">
                            <div className="flex items-start justify-between gap-5">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">Challenge Completed</p>
                                    <h2 className="mt-1.5 text-[1.45rem] font-semibold leading-tight text-slate-900">
                                        Great Job! All tests passed.
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Your solution passed every test case successfully.
                                    </p>
                                </div>

                                <motion.div
                                    className="relative flex h-12 w-14 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-lg font-semibold text-emerald-700 shadow-sm"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: [0.94, 1.08, 1], opacity: 1 }}
                                    transition={{ delay: 0.08, duration: 0.45, times: [0, 0.55, 1] }}
                                >
                                    <motion.span
                                        className="absolute inset-0 rounded-xl bg-emerald-100"
                                        initial={{ scale: 0.7, opacity: 0.55 }}
                                        animate={{ scale: [0.7, 1.3], opacity: [0.55, 0] }}
                                        transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
                                    />
                                    ✓
                                </motion.div>
                            </div>
                        </div>

                        <div className="px-5 py-4 md:px-6">
                            <div className="space-y-2.5">
                                {testCaseLabels.map((label, index) => (
                                    <motion.div
                                        key={label}
                                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ delay: 0.08 + index * 0.03, duration: 0.18 }}
                                    >
                                        <p className="text-sm font-medium text-slate-800">
                                            {testCaseLabels.length > 0 ? `Test Case ${index + 1}` : label}
                                        </p>
                                        <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                            Passed
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-6">
                            <button
                                type="button"
                                onClick={onMenu}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                            >
                                Menu
                            </button>
                            <button
                                type="button"
                                onClick={onNext}
                                className="rounded-lg border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                                Next
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
