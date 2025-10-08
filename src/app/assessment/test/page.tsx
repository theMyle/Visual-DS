"use client";

import { useState } from "react";
import ProgressDots from "../components/ProgressDots";
import { Assessment } from "../types";
import { button, div } from "framer-motion/client";
import { arrayListAssessment } from "./questions";

export default function Test() {
    const assessment = arrayListAssessment;

    // REMOVE THIS LATER
    const [testFlag, setTestFlag] = useState(false);

    // stuff for progress dots
    const totalQuestions = assessment.questions.length;

    // states for progress dots
    const [currentDot, setCurrentDot] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctDots, setCorrectDots] = useState<boolean[]>(() => Array(totalQuestions).fill(false));

    // progress dots operations and stuff
    function handleCorrectAnswer() {
        setCorrectDots(p => {
            let newCorrectDots = [...p];
            newCorrectDots[currentDot] = true;
            return newCorrectDots;
        });

        setCurrentDot(c => {
            let nextIndex = c + 1;
            return nextIndex;
        });

        setAnsweredCount(c => c + 1);
    }

    function handleWrongAnswer() {
        setCurrentDot(c => c + 1);
        setAnsweredCount(c => c + 1);
    }

    function checkIfLastItem() {
        // route to summary page or something or just showing a modal for summary?
    }

    function nextQuestion(idx: number) {
        setCurrentQuestion(assessment.questions[idx]);
    }

    // assessment states
    const [currentQuestion, setCurrentQuestion] = useState(assessment.questions[0]);
    const [selectedButton, setSelectedButton] = useState<string | null>(null);

    return (
        <>
            <div className="h-full flex flex-col ">
                <div className="shrink-0 pt-4">
                    <ProgressDots
                        current={currentDot}
                        total={totalQuestions}
                        answeredCount={answeredCount}
                        correct={correctDots}
                    />
                    {testFlag && <TestButtons rightOnclick={handleCorrectAnswer} wrongOnclick={handleWrongAnswer} />}
                </div>

                <div className="flex flex-1 flex-col justify-center gap-10">
                    {/* Current question */}

                    <div className="shrink-0 flex flex-col  items-center">
                        <p>{currentQuestion.text}</p>
                    </div>

                    {/* Custom image/diagram if present */}

                    {/* Choices render */}
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 gap-4 max-w-2xl w-full px-4">
                            {currentQuestion.choices.map((choice, index) => (
                                <button
                                    key={choice.id}
                                    className={`cursor-pointer px-3 py-3 rounded-xl text-center border-2 border-gray-300 transition-all duration-200 ${selectedButton === choice.id
                                        ? 'bg-indigo-50 text-indigo-600 border-indigo-400'
                                        : 'text-black'
                                        }`}
                                    onClick={() => setSelectedButton(choice.id)}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hidden feedback */}

                </div>

                {/* Check Button */}
                <div className="shrink-0 w-full border-t-2 border-gray-400 bg-white p-4 flex justify-center">
                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500"
                        onClick={() => {
                            // Handle check button click
                            console.log("Check button clicked");
                        }}
                        disabled={!selectedButton}
                    >
                        Check Answer
                    </button>
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
            <button className="p-2 bg-blue-200 rounded-lg" onClick={wrongOnclick}>Wrong</button>
            <button className="p-2 bg-blue-200 rounded-lg" onClick={rightOnclick}>Correct</button>
        </div>
    )
}