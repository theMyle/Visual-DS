'use client';

import { AnimatePresence, motion } from "framer-motion";

type ChallengeCompletedModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onMenu: () => void;
    onNext: () => void;
    testCaseLabels: string[];
};

export default function ChallengeCompletedModal({
    isOpen,
    onClose,
    onMenu,
    onNext,
    testCaseLabels,
}: ChallengeCompletedModalProps) {
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
                                    className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-lg font-semibold text-emerald-700 shadow-sm"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.08, duration: 0.2 }}
                                >
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
