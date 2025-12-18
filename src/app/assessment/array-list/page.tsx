"use client";

import { useEffect, useRef, useState } from "react";
import ProgressDots from "../components/ProgressDots";
import { Choice } from "../types";
import { arrayListAssessment } from "./questions";
import Image from "next/image";

export default function Test() {
    // Shuffle questions once on mount
    const [assessment] = useState(() => ({
        ...arrayListAssessment,
        questions: [...arrayListAssessment.questions].sort(() => Math.random() - 0.5)
    }));

    // REMOVE THIS LATER
    const [testFlag] = useState(false);

    // stuff for progress dots
    const totalQuestions = assessment.questions.length;

    // states for progress dots
    const [currentDot, setCurrentDot] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctDots, setCorrectDots] = useState<boolean[]>(() => Array(totalQuestions).fill(false));

    // assessment states
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

    // progress dots operations and stuff
    function handleCorrectAnswer() {
        setCorrectDots(p => {
            const newCorrectDots = [...p];
            newCorrectDots[currentDot] = true;
            return newCorrectDots;
        });

        setCurrentDot(c => c + 1);
    }

    function handleWrongAnswer() {
        setCurrentDot(c => c + 1);
    }


    // function handleNextQuestion(currentIdx: number) {
    //     // check if it's last
    //     if (currentIdx === assessment.questions.length) {
    //         // todo - show summary
    //         alert("done!");
    //     } else {
    //         // next question
    //         setCurrentQuestion(assessment.questions[currentIdx]);
    //     }
    // }


    function handleNextQuestion2() {
        // check if it's last
        if (answeredCount === assessment.questions.length) {
            // todo - show summary
            alert("done!");
        } else {
            // next question
            setCurrentQuestion(assessment.questions[answeredCount]);
        }
    }

    function handleCheck() {
        const correctAnswer = currentQuestion.choices.find(choice => choice.is_correct)!;
        const isCorrect = correctAnswer.id === selectedButton;

        setAnswerIsCorrect(isCorrect);
        setFeedbackMode(() => {
            // small delay - wait for feed back to show up
            setTimeout(() => {
                if (questionDiv.current) {
                    questionDiv.current.scrollTo({
                        top: 1000,
                        behavior: "smooth",
                    })
                }
            }, 300)
            return true;
        });

        if (isCorrect) {
            handleCorrectAnswer()
        } else {
            handleWrongAnswer();
        }
        setAnsweredCount(c => c + 1);
    }

    function handleContinue() {
        setFeedbackMode(false);
        setSelectedButton(null);
        handleNextQuestion2();
    }

    // tailwind calculations
    // bottom nav background
    let bottomNavBackground = "bg-white";
    let continueButtonColor = "bg-green-400 active:bg-green-600 hover:bg-green-500"
    if (feedbackMode && answerIsCorrect) {
        bottomNavBackground = "bg-green-50"
    } else if (feedbackMode && !answerIsCorrect) {
        bottomNavBackground = "bg-red-50"
        continueButtonColor = "bg-gray-400 active:bg-gray-600 hover:bg-gray-500"
    }

    // button choices
    return (
        <>
            <div className="h-full flex flex-col ">
                <div className="shrink-0">
                    <ProgressDots
                        current={currentDot}
                        total={totalQuestions}
                        answeredCount={answeredCount}
                        correct={correctDots}
                    />

                    {/* test stuff */}
                    {testFlag && <TestButtons rightOnclick={handleCorrectAnswer} wrongOnclick={handleWrongAnswer} />}

                </div>

                <div ref={questionDiv} className="flex-1 flex flex-col overflow-y-auto">
                    {/* Mobile: vertical layout, Desktop: 3:2 split layout */}
                    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-8 min-h-full py-8 px-4 lg:px-8">

                        {/* LEFT SIDE - Questions and Images (3 parts on desktop) */}
                        <div className="flex flex-col justify-center items-center gap-8 lg:col-span-3">
                            {/* Current question */}
                            <div className="flex flex-col items-center justify-center max-w-3xl w-full">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-sm border border-indigo-100">
                                    <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-800 text-center leading-relaxed">
                                        {currentQuestion.text}
                                    </p>
                                </div>
                            </div>

                            {/* Custom image/diagram if present */}
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

                            {/* Feedback - desktop only, appears on left side with questions */}
                            {feedbackMode && (answerIsCorrect ? correctFeedback : wrongFeedback) && (
                                <div className="hidden lg:flex justify-center w-full opacity-0 animate-fade-in">
                                    <div className={`max-w-3xl w-full flex flex-col gap-2 p-6 rounded-2xl border-2 shadow-md ${(answerIsCorrect ?
                                        "bg-green-50 border-green-300"
                                        :
                                        "bg-red-50 border-red-300"
                                    )}`}>
                                        <h1 className="font-bold text-lg">Explanation</h1>
                                        <p className="text-gray-700 leading-relaxed">{answerIsCorrect ? correctFeedback : wrongFeedback}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE - Choices (2 parts on desktop) */}
                        <div className="flex justify-center items-center lg:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 max-w-2xl lg:max-w-lg w-full">
                                {shuffledChoices.map((choice: Choice) => {
                                    const isSelected = selectedButton === choice.id;
                                    const isCorrect = choice.is_correct;

                                    let buttonClass = `
        cursor-pointer px-4 py-4 md:px-5 md:py-5 rounded-xl text-center border-2 transition-all duration-200 text-base md:text-lg shadow-sm hover:shadow-md
    `;

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

                        {/* Feedback - mobile/tablet only, appears at bottom for auto-scroll */}
                        {feedbackMode && (answerIsCorrect ? correctFeedback : wrongFeedback) && (
                            <div className="lg:hidden flex justify-center w-full lg:col-span-5 opacity-0 animate-fade-in pb-4">
                                <div className={`max-w-3xl w-full flex flex-col gap-2 p-6 rounded-2xl border-2 shadow-md ${(answerIsCorrect ?
                                    "bg-green-50 border-green-300"
                                    :
                                    "bg-red-50 border-red-300"
                                )}`}>
                                    <h1 className="font-bold text-lg">Explanation</h1>
                                    <p className="text-gray-700 leading-relaxed">{answerIsCorrect ? correctFeedback : wrongFeedback}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Check Button */}
                <div
                    className={
                        `shrink-0 w-full border-t-2 border-gray-400 p-4 flex justify-center h-24 ${bottomNavBackground}`
                    }
                >
                    {
                        !feedbackMode &&
                        <button
                            className="w-full md:w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500"
                            onClick={() => handleCheck()}
                            disabled={!selectedButton}
                        >
                            Check
                        </button>
                    }

                    {
                        feedbackMode &&
                        <div className="flex justify-between items-center w-full max-w-2xl px-2">
                            <div className="flex items-center gap-2">
                                {answerIsCorrect ? (
                                    <>
                                        <svg className="w-6 h-6 md:w-7 md:h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-bold text-lg md:text-xl text-green-700">Correct!</p>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 md:w-7 md:h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-bold text-lg md:text-xl text-red-700">Incorrect</p>
                                    </>
                                )}
                            </div>
                            <button
                                className={`rounded-full px-6 md:px-8 py-2 text-white font-bold text-base md:text-lg transition-all ${continueButtonColor}`}
                                onClick={() => handleContinue()}
                            >Continue</button>
                        </div>
                    }
                </div>
            </div>

        </>
    )
}


// testing stuff
type TestButtonsProps = {
    wrongOnclick: () => void;
    rightOnclick: () => void;
}

function TestButtons({ wrongOnclick, rightOnclick }: TestButtonsProps) {
    return (
        <div className="flex justify-center gap-5">
            {/* buttons for testing */}
            <button className="p-2 bg-blue-200 rounded-lg" onClick={wrongOnclick}>Incorrect</button>
            <button className="p-2 bg-blue-200 rounded-lg" onClick={rightOnclick}>Correct</button>
        </div>
    )
}