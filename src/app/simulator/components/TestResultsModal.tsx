import { AnimatePresence, motion } from "framer-motion";

interface TestResult {
    name: string;
    passed: boolean;
    expected: (string | number)[];
    actual: (string | number)[];
}

interface TestResultsModalProps {
    isOpen: boolean;
    results: TestResult[] | null;
    onClose: () => void;
}

export default function TestResultsModal({
    isOpen,
    results,
    onClose,
}: TestResultsModalProps) {
    if (!results) return null;

    const allPassed = results.every((r) => r.passed);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto z-50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Test Results
                            </h2>
                            <div
                                className={`px-4 py-2 rounded-full font-semibold ${allPassed
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {allPassed ? "✓ All Passed" : `✗ ${results.filter(r => !r.passed).length} Failed`}
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="space-y-4 mb-6">
                            {results.map((result, index) => (
                                <motion.div
                                    key={index}
                                    className={`border-2 rounded-lg p-4 ${result.passed
                                            ? "border-emerald-200 bg-emerald-50"
                                            : "border-red-200 bg-red-50"
                                        }`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {/* Test Case Name */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`text-xl font-bold ${result.passed ? "text-emerald-600" : "text-red-600"
                                                }`}
                                        >
                                            {result.passed ? "✓" : "✗"}
                                        </span>
                                        <h3 className="font-semibold text-gray-800">
                                            {result.name}
                                        </h3>
                                    </div>

                                    {/* Arrays Display */}
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <div>
                                            <span className="font-semibold">Expected:</span>{" "}
                                            <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">
                                                [{result.expected.join(", ")}]
                                            </code>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Actual:</span>{" "}
                                            <code
                                                className={`px-2 py-1 rounded text-xs font-mono ${result.passed
                                                        ? "bg-emerald-200"
                                                        : "bg-red-200"
                                                    }`}
                                            >
                                                [{result.actual.join(", ")}]
                                            </code>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
