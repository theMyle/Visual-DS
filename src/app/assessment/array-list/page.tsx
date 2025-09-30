"use client";

import { useState } from "react";
import Assessment from "../components/Assessment";
import ProgressDots from "../components/ProgressDots";
import VisualArray from "@/app/simulator/array-list/components/VisualArray";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";


export default function arrayListAssessment() {
  // STATES
  const [finished, setFinished] = useState(false);
  const total = 10;
  const [current, setCurrent] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correct, setCorrect] = useState<boolean[]>(() => Array(total).fill(false));

  const [testArray] = useState(createArrayElements(0, 2, 1, 3, 5));
  const [selectedChoice, setSelectedChoice] = useState<string>('');

  // check if it was the last item
  const isLastItem = () => {
    if (current == total - 1) {
      setFinished(true);
      return true;
    }

    return false;
  }

  // triggers when answer is correct
  const handleCorrect = () => {
    setCurrent(c => c + 1);
    setAnsweredCount(c => c + 1);
    setCorrect(prev => {
      const newCorrect = [...prev];
      newCorrect[current] = true;
      return newCorrect
    });

    if (isLastItem()) return;
  }

  // triggers when answer is wrong
  const handleWrong = () => {
    setCurrent(c => c + 1);
    setAnsweredCount(c => c + 1);

    if (isLastItem()) return;
  }

  const handleCheck = () => {
  }

  return (
    <div className="h-full flex flex-col"> {/* Use h-full to fill parent, not min-h-screen */}
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-10 p-4">
          {/* Progress */}
          <div className="shrink-0 pt-4">
            <ProgressDots
              current={current}
              total={total}
              answeredCount={answeredCount}
              correct={correct}
            ></ProgressDots>
          </div>

          {/* Question */}
          <div className="">
            <p>How do you access/get the value "5" in this array?</p>
          </div>

          {/* Visualization */}
          <VisualArray array={testArray} />

          {/* Buttons/Choices */}
          {/* 'bg-green-100 border-green-600 text-green-800' */}

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {['array[4]', 'array[5]', 'Array[7]', 'array.get(5)'].map((choice, index) => (
              <label
                key={index}
                className={`
            cursor-pointer px-3 py-3 rounded-xl text-center border-2 border-gray-300 transition-all
            ${selectedChoice === choice
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-400'
                    : 'text-black'
                  }
          `}
              >
                <input
                  type="radio"
                  name="answer"
                  value={choice}
                  checked={selectedChoice === choice}
                  onChange={(e) => setSelectedChoice(e.target.value)}
                  className="sr-only" // Hide the actual radio button
                />
                {choice}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM - Check Button */}
      <div className="shrink-0 w-full border-t-2 border-gray-400 bg-white">
        <div className="w-full max-w-md mx-auto p-4">
          <div className="flex justify-center items-center">
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={handleCheck}
              disabled={!selectedChoice}
            >
              Check
            </button>
          </div>

          {/* Feedback section - show when answered */}
          {/* <div className="mt-4 p-4 bg-green-100 rounded-xl flex justify-between items-center">
            <p className="text-green-700 font-medium">Correct!</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Continue</button>
          </div> */}
        </div>
      </div>
    </div>
  )
}