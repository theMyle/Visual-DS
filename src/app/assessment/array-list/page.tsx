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
                    <div className="flex flex-col justify-around gap-10 min-h-full py-4">
                        {/* Current question */}

                        <div className="shrink-0 flex flex-col items-center px-8 text-lg">
                            <p>{currentQuestion.text}</p>
                        </div>

                        {/* Custom image/diagram if present */}
                        {currentQuestion.image_url &&
                            <div className="flex justify-center">
                                <Image
                                    src={currentQuestion.image_url}
                                    alt="Image diagram"
                                    width={300}
                                    height={0}
                                />
                            </div>
                        }

                        {/* Choices render */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-2 gap-4 max-w-2xl w-full px-4">
                                {shuffledChoices.map((choice: Choice) => {
                                    const isSelected = selectedButton === choice.id;
                                    const isCorrect = choice.is_correct;

                                    let buttonClass = `
        cursor-pointer px-3 py-3 rounded-xl text-center border-2 border-gray-300 transition-all duration-200
    `;

                                    if (isSelected && !feedbackMode) {
                                        buttonClass += " bg-indigo-50 text-indigo-600 border-indigo-400";
                                    } else if (isSelected && feedbackMode && isCorrect) {
                                        buttonClass += " bg-green-200 text-green-900 border-green-400";
                                    } else if (isSelected && feedbackMode && !isCorrect) {
                                        buttonClass += " bg-red-200 text-red-800 border-red-400";
                                    } else {
                                        buttonClass += " text-black";
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


                        {/* Feedback */}
                        {feedbackMode && (answerIsCorrect ? correctFeedback : wrongFeedback) && (
                            <div className="flex justify-center pb-10 opacity-0 animate-fade-in">
                                <div className={`lg:max-w-160 lg:min-w-160 bg-gray-200 flex flex-col gap-2 p-4 ml-4 mr-4 rounded-2xl border-2 border-gray-300 ${(answerIsCorrect ?
                                    " bg-green-50"
                                    :
                                    "bg-red-50"
                                )}`}>
                                    <h1 className="font-bold">Explanation</h1>
                                    <p>{answerIsCorrect ? correctFeedback : wrongFeedback}</p>
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
                        <div className="flex justify-between items-center w-70">
                            <p className="font-bold text-lg">{answerIsCorrect ? "Correct!" : "Incorrect"}</p>
                            <button
                                className={` rounded-4xl px-8 py-2 text-white font-bold text-lg ${continueButtonColor}`}
                                onClick={() => handleContinue()}
                            >Contiue</button>
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