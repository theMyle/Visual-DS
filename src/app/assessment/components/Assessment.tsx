"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProgressDots from "./ProgressDots";
import AssessmentSummary from "./AssessmentSummary";
import type { Assessment as AssessmentType, Choice } from "../types";

type AssessmentProps = {
    assessmentData: AssessmentType;
};

export default function Assessment({ assessmentData }: AssessmentProps) {
    const router = useRouter();

    // Shuffle questions once on mount for each route-specific assessment.
    const [assessment] = useState(() => ({
        ...assessmentData,
        questions: [...assessmentData.questions].sort(() => Math.random() - 0.5),
    }));

    const [showSummary, setShowSummary] = useState(false);
    const totalQuestions = assessment.questions.length;

    const [currentDot, setCurrentDot] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctDots, setCorrectDots] = useState<boolean[]>(() =>
        Array(totalQuestions).fill(false)
    );

    const [currentQuestion, setCurrentQuestion] = useState(assessment.questions[0]);
    const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);

    const [correctFeedback, setCorrectFeedback] = useState("");
    const [wrongFeedback, setWrongFeedback] = useState("");

    useEffect(() => {
        setCorrectFeedback(currentQuestion.feedback.correct);
        setWrongFeedback(currentQuestion.feedback.incorrect);

        const shuffled = [...currentQuestion.choices].sort(() => Math.random() - 0.5);
        setShuffledChoices(shuffled);
    }, [currentQuestion]);

    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [answerIsCorrect, setAnswerIsCorrect] = useState(false);

    const questionDiv = useRef<HTMLDivElement>(null);

    function handleCorrectAnswer() {
        setCorrectDots((previous) => {
            const newCorrectDots = [...previous];
            newCorrectDots[currentDot] = true;
            return newCorrectDots;
        });

        setCurrentDot((current) => current + 1);
    }

    function handleWrongAnswer() {
        setCurrentDot((current) => current + 1);
    }

    function handleNextQuestion() {
        if (answeredCount === assessment.questions.length) {
            setShowSummary(true);
            return;
        }

        setCurrentQuestion(assessment.questions[answeredCount]);
    }

    function handleRetry() {
        setShowSummary(false);
        setCurrentDot(0);
        setAnsweredCount(0);
        setCorrectDots(Array(totalQuestions).fill(false));
        setCurrentQuestion(assessment.questions[0]);
        setSelectedButton(null);
        setFeedbackMode(false);
        setAnswerIsCorrect(false);
    }

    function handleBackToHome() {
        router.push("/assessment");
    }

    function handleCheck() {
        const correctAnswer = currentQuestion.choices.find((choice) => choice.is_correct)!;
        const isCorrect = correctAnswer.id === selectedButton;

        setAnswerIsCorrect(isCorrect);
        setFeedbackMode(() => {
            // Delay scroll until feedback has rendered.
            setTimeout(() => {
                if (questionDiv.current) {
                    questionDiv.current.scrollTo({
                        top: 1000,
                        behavior: "smooth",
                    });
                }
            }, 300);
            return true;
        });

        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
        }
        setAnsweredCount((current) => current + 1);
    }

    function handleContinue() {
        setFeedbackMode(false);
        setSelectedButton(null);
        handleNextQuestion();
    }

    let bottomNavBackground = "bg-white";
    let continueButtonColor = "bg-green-400 active:bg-green-600 hover:bg-green-500";
    if (feedbackMode && answerIsCorrect) {
        bottomNavBackground = "bg-green-50";
    } else if (feedbackMode && !answerIsCorrect) {
        bottomNavBackground = "bg-red-50";
        continueButtonColor = "bg-gray-400 active:bg-gray-600 hover:bg-gray-500";
    }

    if (showSummary) {
        const correctCount = correctDots.filter(Boolean).length;
        return (
            <AssessmentSummary
                correctCount={correctCount}
                totalQuestions={totalQuestions}
                onRetry={handleRetry}
                onBackToHome={handleBackToHome}
            />
        );
    }

    return (
        <div className="h-full flex flex-col ">
            <div className="shrink-0">
                <ProgressDots
                    current={currentDot}
                    total={totalQuestions}
                    answeredCount={answeredCount}
                    correct={correctDots}
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
                                        height={0}
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {feedbackMode && (answerIsCorrect ? correctFeedback : wrongFeedback) && (
                            <div className="hidden lg:flex justify-center w-full opacity-0 animate-fade-in">
                                <div
                                    className={`max-w-3xl w-full flex flex-col gap-2 p-6 rounded-2xl border-2 shadow-md ${answerIsCorrect
                                            ? "bg-green-50 border-green-300"
                                            : "bg-red-50 border-red-300"
                                        }`}
                                >
                                    <h1 className="font-bold text-lg">Explanation</h1>
                                    <p className="text-gray-700 leading-relaxed">
                                        {answerIsCorrect ? correctFeedback : wrongFeedback}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center items-center lg:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 max-w-2xl lg:max-w-lg w-full">
                            {shuffledChoices.map((choice: Choice) => {
                                const isSelected = selectedButton === choice.id;
                                const isCorrect = choice.is_correct;

                                let buttonClass =
                                    "cursor-pointer px-4 py-4 md:px-5 md:py-5 rounded-xl text-center border-2 transition-all duration-200 text-base md:text-lg shadow-sm hover:shadow-md";

                                if (isSelected && !feedbackMode) {
                                    buttonClass += " bg-indigo-100 text-indigo-700 border-indigo-400 shadow-md scale-[1.02]";
                                } else if (isSelected && feedbackMode && isCorrect) {
                                    buttonClass += " bg-green-100 text-green-900 border-green-500 shadow-md";
                                } else if (isSelected && feedbackMode && !isCorrect) {
                                    buttonClass += " bg-red-100 text-red-800 border-red-400 shadow-md";
                                } else {
                                    buttonClass += " bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50";
                                }

                                return (
                                    <button
                                        key={choice.id}
                                        className={buttonClass}
                                        onClick={() => setSelectedButton(choice.id)}
                                        disabled={feedbackMode}
                                    >
                                        {choice.text}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {feedbackMode && (answerIsCorrect ? correctFeedback : wrongFeedback) && (
                        <div className="lg:hidden flex justify-center w-full lg:col-span-5 opacity-0 animate-fade-in pb-4">
                            <div
                                className={`max-w-3xl w-full flex flex-col gap-2 p-6 rounded-2xl border-2 shadow-md ${answerIsCorrect
                                        ? "bg-green-50 border-green-300"
                                        : "bg-red-50 border-red-300"
                                    }`}
                            >
                                <h1 className="font-bold text-lg">Explanation</h1>
                                <p className="text-gray-700 leading-relaxed">
                                    {answerIsCorrect ? correctFeedback : wrongFeedback}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`shrink-0 w-full border-t-2 border-gray-400 p-4 flex justify-center h-24 ${bottomNavBackground}`}
            >
                {!feedbackMode && (
                    <button
                        className="w-full md:w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500"
                        onClick={handleCheck}
                        disabled={!selectedButton}
                    >
                        Check
                    </button>
                )}

                {feedbackMode && (
                    <div className="flex justify-between items-center w-full max-w-2xl px-2">
                        <div className="flex items-center gap-2">
                            {answerIsCorrect ? (
                                <>
                                    <svg
                                        className="w-6 h-6 md:w-7 md:h-7 text-green-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="font-bold text-lg md:text-xl text-green-700">Correct!</p>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-6 h-6 md:w-7 md:h-7 text-red-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="font-bold text-lg md:text-xl text-red-700">Incorrect</p>
                                </>
                            )}
                        </div>
                        <button
                            className={`rounded-full px-6 md:px-8 py-2 text-white font-bold text-base md:text-lg transition-all ${continueButtonColor}`}
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
