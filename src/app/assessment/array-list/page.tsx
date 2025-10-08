"use client";

import { useState, useRef, useEffect } from "react";
import Assessment from "../components/Assessment";
import ProgressDots from "../components/ProgressDots";
import VisualArray from "@/app/simulator/array-list/components/VisualArray";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";
import { arrayListAssessment } from "./questions";


export default function ArrayListAssessmentPage() {
  const [questions, setQuestions] = useState(() => arrayListAssessment.questions);
  const [finished, setFinished] = useState(false);
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correct, setCorrect] = useState<boolean[]>(() => Array(questions.length).fill(false));

  const [testArray] = useState(createArrayElements(0, 2, 1, 3, 5));
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const feedbackRef = useRef<HTMLDivElement | null>(null);

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
    if (!selectedChoice) return;

    const q = questions[current];
    // find matching choice by text
    const found = q.choices.find(c => c.text === selectedChoice);
    const isCorrect = !!found && found.is_correct;

    // determine feedback message from the question.feedback tuple
    let msg = '';
    if (isCorrect) {
      // look for a non-empty correct message
      const fb = q.feedback.find(f => f.correct && f.correct.trim() !== '');
      msg = fb ? fb.correct : 'Correct!';
    } else {
      const fb = q.feedback.find(f => f.incorrect && f.incorrect.trim() !== '');
      msg = fb ? fb.incorrect : 'Incorrect.';
    }

    setLastAnswerCorrect(isCorrect);
    setFeedbackMessage(msg);
    setShowFeedback(true);
  }

  // Scroll feedback into view after it becomes visible (run after DOM updates)
  useEffect(() => {
    if (showFeedback) {
      // small timeout to allow layout & CSS transitions to start
      const id = window.setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 40);
      return () => window.clearTimeout(id);
    }
    return;
  }, [showFeedback]);

  const handleContinue = () => {
    // apply the result to state and move to next question
    if (lastAnswerCorrect) {
      // mark correct and advance
      setCorrect(prev => {
        const next = [...prev];
        next[current] = true;
        return next;
      });
    }

    // increment answered count and current index
    setAnsweredCount(c => c + 1);
    setCurrent(c => c + 1);

    // reset selection and feedback UI
    setSelectedChoice('');
    setShowFeedback(false);
    setLastAnswerCorrect(null);
    setFeedbackMessage('');
  }

  return (
    <div className="h-full flex flex-col"> {/* Use h-full to fill parent, not min-h-screen */}
      {/* Static top - Progress (does not scroll) */}
      <div className="shrink-0 pt-4">
        <ProgressDots
          current={current}
          total={total}
          answeredCount={answeredCount}
          correct={correct}
        />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">

          {/* Question */}
          <div className="flex flex-col items-center gap-10">
            <div className="">
              <p>How do you access/get the value "5" in this array?</p>
            </div>

            {/* Visualization */}
            <VisualArray array={testArray} />

            {/* Buttons/Choices */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {questions[current].choices.map((choice, index) => (
                <label
                  key={choice.id}
                  className={`
            cursor-pointer px-3 py-3 rounded-xl text-center border-2 border-gray-300 transition-all
            ${selectedChoice === choice.text
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-400'
                      : 'text-black'
                    }
          `}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={choice.text}
                    checked={selectedChoice === choice.text}
                    onChange={(e) => setSelectedChoice(e.target.value)}
                    className="sr-only"
                  />
                  {choice.text}
                </label>
              ))}
            </div>

            {/* Feedback panel (animates height) */}
            <div className="w-full max-w-md mt-4 flex justify-center">
              <div
                ref={feedbackRef}
                className={`w-full rounded-lg overflow-hidden transition-[max-height,opacity] duration-300 ${showFeedback ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} `}
                style={{ backgroundColor: showFeedback ? (lastAnswerCorrect ? '#ECFDF5' : '#FEF3F2') : 'transparent' }}
              >
                <div className={`p-4 transform transition-transform duration-200 ${showFeedback ? 'translate-y-0' : '-translate-y-2'}`}>
                  <p className={`${lastAnswerCorrect ? 'text-green-700' : 'text-red-700'} font-medium`}>{feedbackMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM - Check Button */}
      <div className="shrink-0 w-full border-t-2 border-gray-400 bg-white">
        <div className="w-full max-w-md mx-auto p-4">
          <div className="flex justify-center items-center">
            {!showFeedback ? (
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={handleCheck}
                disabled={!selectedChoice}
              >
                Check
              </button>
            ) : (
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl active:bg-green-800"
                onClick={handleContinue}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}