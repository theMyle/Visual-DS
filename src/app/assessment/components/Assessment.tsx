"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import ProgressDots from "./ProgressDots";
import AssessmentSummary from "./AssessmentSummary";
import type { Assessment as AssessmentType, Choice } from "../types";
import { FetchWithAuth } from "../../lib/fetchWithAuth";

type AssessmentProps = {
    assessmentData: AssessmentType;
    attemptsUsed?: number;
    maxAttempts?: number | null;
};

type QuestionOutcome = {
    question_id: string;
    is_correct: boolean;
};

type SubmitAssessmentRequest = {
    quiz_id: string;
    quiz_category: string;
    score: number;
    total_items: number;
    outcomes: QuestionOutcome[];
};


export default function Assessment({ assessmentData, attemptsUsed = 0, maxAttempts = null }: AssessmentProps) {
    const router = useRouter();
    const { isLoaded, isSignedIn, userId, getToken } = useAuth();
    const { redirectToSignIn } = useClerk();
    const [isMounted, setIsMounted] = useState(false);

    const [localAttemptsUsed, setLocalAttemptsUsed] = useState(attemptsUsed);

    const [assessment, setAssessment] = useState<AssessmentType | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const totalQuestions = assessment?.questions.length ?? 0;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [questionOutcomes, setQuestionOutcomes] = useState<QuestionOutcome[]>([]);
    const [shuffledChoicesMap, setShuffledChoicesMap] = useState<Record<string, Choice[]>>({});

    const hasSubmittedAssessmentRef = useRef(false);
    const attemptsRemaining = maxAttempts !== null ? maxAttempts - localAttemptsUsed : null;
    const canRetry = attemptsRemaining === null || attemptsRemaining > 0;

    useEffect(() => {
        const shuffledQuestions = [...assessmentData.questions].sort(() => Math.random() - 0.5);

        const choicesMap: Record<string, Choice[]> = {};
        shuffledQuestions.forEach(q => {
            choicesMap[q.id] = [...q.choices].sort(() => Math.random() - 0.5);
        });

        const initializedAssessment = {
            ...assessmentData,
            questions: shuffledQuestions,
        };

        setAssessment(initializedAssessment);
        setShuffledChoicesMap(choicesMap);
        setSelectedAnswers({});
        setQuestionOutcomes([]);
        setShowSummary(false);
        setCurrentQuestionIndex(0);

        setIsMounted(true);
    }, [assessmentData]);

    const currentQuestion = assessment?.questions[currentQuestionIndex] ?? null;
    const shuffledChoices = currentQuestion ? shuffledChoicesMap[currentQuestion.id] || [] : [];

    const questionDiv = useRef<HTMLDivElement>(null);

    const correctCount = questionOutcomes.filter(outcome => outcome.is_correct).length;

    const submitAssessmentMutation = useMutation({
        mutationFn: async (payload: SubmitAssessmentRequest) => {
            return FetchWithAuth(
                "/api/assessments/submit",
                getToken,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                },
            );
        },
        onSuccess: () => {
            console.log("Assessment submitted successfully.");
            setLocalAttemptsUsed(prev => prev + 1);
        },
        onError: (error) => {
            console.error("Failed to submit assessment:", error);
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleNext() {
        if (!assessment || !currentQuestion) return;

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= assessment.questions.length) {
            // Final submission
            const outcomes: QuestionOutcome[] = assessment.questions.map(q => {
                const selectedChoiceId = selectedAnswers[q.id];
                const choice = q.choices.find(c => c.id === selectedChoiceId);
                return {
                    question_id: q.id,
                    is_correct: choice?.is_correct ?? false
                };
            });
            setQuestionOutcomes(outcomes);

            // Sync BEFORE displaying result
            if (isSignedIn && userId) {
                setIsSubmitting(true);
                try {
                    console.log("[Submit] Syncing assessment result...");
                    const correctCount = outcomes.filter(o => o.is_correct).length;
                    await submitAssessmentMutation.mutateAsync({
                        quiz_id: assessmentData.id,
                        quiz_category: assessmentData.category,
                        score: correctCount,
                        total_items: assessment.questions.length,
                        outcomes: outcomes,
                    });
                    console.log("[Submit] Sync complete.");
                } catch (error) {
                    console.error("Failed to sync assessment:", error);
                    // We still show summary even on error so user sees their score,
                    // but they'll know it didn't save if we add an error state (future work)
                } finally {
                    setIsSubmitting(false);
                }
            }

            setShowSummary(true);
        } else {
            setCurrentQuestionIndex(nextIndex);
            if (questionDiv.current) {
                questionDiv.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }

    function handleBack() {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            if (questionDiv.current) {
                questionDiv.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }

    function handleRetry() {
        if (!assessment || !canRetry) return;

        setShowSummary(false);
        hasSubmittedAssessmentRef.current = false;
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setQuestionOutcomes([]);

        // Re-shuffle for retry
        const shuffledQuestions = [...assessment.questions].sort(() => Math.random() - 0.5);
        const choicesMap: Record<string, Choice[]> = {};
        shuffledQuestions.forEach(q => {
            choicesMap[q.id] = [...q.choices].sort(() => Math.random() - 0.5);
        });

        setAssessment({ ...assessment, questions: shuffledQuestions });
        setShuffledChoicesMap(choicesMap);
    }

    function handleBackToHome() {
        router.push("/assessment");
    }


    const handleLoginToSaveProgress = async () => {
        await redirectToSignIn({ redirectUrl: window.location.href });
    };

    if (isSubmitting) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg font-bold text-slate-700">Saving your results...</p>
                    <p className="text-sm text-slate-500">Please wait a moment.</p>
                </div>
            </div>
        );
    }

    if (!isMounted || !assessment || !currentQuestion) {
        return null;
    }

    if (showSummary) {
        return (
            <AssessmentSummary
                questions={assessment.questions}
                selectedAnswers={selectedAnswers}
                correctCount={correctCount}
                totalQuestions={totalQuestions}
                isSyncing={submitAssessmentMutation.isPending}
                showLoginButton={isLoaded && !isSignedIn}
                canRetry={canRetry}
                attemptsRemaining={attemptsRemaining}
                onLoginToSaveProgress={handleLoginToSaveProgress}
                onRetry={handleRetry}
                onBackToHome={handleBackToHome}
            />
        );
    }

    const answeredCount = Object.keys(selectedAnswers).length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const currentSelection = selectedAnswers[currentQuestion.id];

    return (
        <div className="h-full flex flex-col ">
            <div className="shrink-0">
                <ProgressDots
                    current={currentQuestionIndex}
                    total={totalQuestions}
                    answeredIndices={Object.keys(selectedAnswers).map(id => assessment.questions.findIndex(q => q.id === id))}
                />
            </div>

            <div ref={questionDiv} className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-8 min-h-full py-8 px-4 lg:px-8">
                    <div className="flex flex-col justify-center items-center gap-8 lg:col-span-3">
                        <div className="flex flex-col items-center justify-center max-w-3xl w-full">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-sm border border-indigo-100 border-l-indigo-400 border-l-8">
                                <p className="text-lg md:text-xl lg:text-2xl text-gray-800 text-center leading-relaxed">
                                    {currentQuestion.text}
                                </p>
                            </div>
                        </div>

                        {currentQuestion.image_url && (
                            <div className="flex justify-center items-center">
                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                                    <Image
                                        src={currentQuestion.image_url}
                                        alt="Question diagram"
                                        width={300}
                                        height={300}
                                        style={{ height: "auto" }}
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center items-center lg:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 max-w-2xl lg:max-w-lg w-full">
                            {shuffledChoices.map((choice: Choice) => {
                                const isSelected = currentSelection === choice.id;

                                let buttonClass =
                                    "cursor-pointer px-4 py-4 md:px-5 md:py-5 rounded-xl text-center border-2 transition-all duration-200 text-base md:text-lg shadow-sm hover:shadow-md";

                                if (isSelected) {
                                    buttonClass += " bg-indigo-100 text-indigo-700 border-indigo-400 shadow-md scale-[1.02]";
                                } else {
                                    buttonClass += " bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50";
                                }

                                return (
                                    <button
                                        key={choice.id}
                                        className={buttonClass}
                                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: choice.id }))}
                                    >
                                        {choice.text}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="shrink-0 w-full border-t-2 border-gray-100 p-4 flex justify-center h-24 bg-white">
                <div className="flex justify-between items-center w-full max-w-4xl gap-4">
                    <button
                        className="flex-1 max-w-[200px] h-12 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                    >
                        Back
                    </button>
                    
                    <button
                        className="flex-1 max-w-[400px] h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500 transition-all shadow-md"
                        onClick={handleNext}
                        disabled={!currentSelection}
                    >
                        {isLastQuestion ? "Finish Assessment" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}
