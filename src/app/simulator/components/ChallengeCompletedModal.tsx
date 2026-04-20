'use client';

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
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] bg-slate-950/60 p-4 md:p-6"
            onClick={onClose}
        >
            <div
                className="mx-auto mt-[8vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
                role="dialog"
                aria-modal="true"
                aria-label="Challenge completed"
                onClick={(event) => event.stopPropagation()}
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

                        <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-lg font-semibold text-emerald-700 shadow-sm">
                            ✓
                        </div>
                    </div>
                </div>

                <div className="px-5 py-4 md:px-6">
                    <div className="space-y-2.5">
                        {testCaseLabels.map((label, index) => (
                            <div
                                key={label}
                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5"
                            >
                                <p className="text-sm font-medium text-slate-800">
                                    {testCaseLabels.length > 0 ? `Test Case ${index + 1}` : label}
                                </p>
                                <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                    Passed
                                </span>
                            </div>
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
            </div>
        </div>
    );
}
