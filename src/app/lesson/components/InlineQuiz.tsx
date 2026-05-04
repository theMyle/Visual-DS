"use client";

import React, { useState } from "react";

interface InlineQuizProps {
  content: string;
}

export default function InlineQuiz({ content }: InlineQuizProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedbackMode, setFeedbackMode] = useState(false);

  // Parse the content
  const lines = content.trim().split("\n");
  let question = "";
  const options: { id: string; text: string }[] = [];
  let answerId = "";
  let feedbackCorrect = "";
  let feedbackWrong = "";

  let parsingMode: "question" | "options" | "answer" | "feedbackCorrect" | "feedbackWrong" = "question";

  for (const line of lines) {
    if (line.trim().startsWith("Answer:")) {
      answerId = line.replace("Answer:", "").trim().toLowerCase();
      parsingMode = "answer";
    } else if (line.trim().startsWith("Feedback Correct:")) {
      feedbackCorrect = line.replace("Feedback Correct:", "").trim();
      parsingMode = "feedbackCorrect";
    } else if (line.trim().startsWith("Feedback Wrong:")) {
      feedbackWrong = line.replace("Feedback Wrong:", "").trim();
      parsingMode = "feedbackWrong";
    } else if (/^[a-z]\.\s/i.test(line.trim())) {
      const match = line.trim().match(/^([a-z])\.\s(.*)/i);
      if (match) {
        options.push({ id: match[1].toLowerCase(), text: match[2] });
      }
      parsingMode = "options";
    } else {
      if (parsingMode === "question") {
        question += line + "\n";
      } else if (parsingMode === "feedbackCorrect") {
        feedbackCorrect += "\n" + line;
      } else if (parsingMode === "feedbackWrong") {
        feedbackWrong += "\n" + line;
      }
    }
  }

  question = question.trim();
  feedbackCorrect = feedbackCorrect.trim();
  feedbackWrong = feedbackWrong.trim();

  // If parsing failed to find options or answer, render a fallback
  if (options.length === 0 || !answerId) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl my-6">
        <strong>Invalid Quiz Format</strong>
        <p className="text-sm mt-2">
          Make sure your quiz block follows the format:
        </p>
        <pre className="text-xs bg-red-100 p-2 rounded mt-2">
          Question text here...{"\n"}
          a. Option 1{"\n"}
          b. Option 2{"\n"}
          Answer: a{"\n"}
          Feedback Correct: Great job!{"\n"}
          Feedback Wrong: Incorrect, try again.
        </pre>
      </div>
    );
  }

  const isCorrect = selectedId === answerId;

  const handleCheck = () => {
    setFeedbackMode(true);
  };

  const handleRetry = () => {
    setFeedbackMode(false);
    setSelectedId(null);
  };

  const currentFeedback = isCorrect ? feedbackCorrect : feedbackWrong;

  return (
    <div className="my-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm border border-indigo-100 border-l-indigo-400 border-l-4 mb-6">
          <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">
            Knowledge Check
          </div>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
            {question}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-3 mb-6">
          {options.map((choice) => {
            const isSelected = selectedId === choice.id;
            const isChoiceCorrect = choice.id === answerId;

            let buttonClass =
              "cursor-pointer px-4 py-2 md:py-2.5 rounded-lg text-left border-2 transition-all duration-200 text-sm md:text-[0.95rem] flex items-center";

            if (isSelected && !feedbackMode) {
              buttonClass +=
                " bg-indigo-100 text-indigo-700 border-indigo-400 shadow-sm scale-[1.01]";
            } else if (isSelected && feedbackMode && isChoiceCorrect) {
              buttonClass +=
                " bg-green-100 text-green-900 border-green-500 shadow-sm";
            } else if (isSelected && feedbackMode && !isChoiceCorrect) {
              buttonClass += " bg-red-100 text-red-800 border-red-400 shadow-sm";
            } else {
              buttonClass +=
                " bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50";
            }

            return (
              <button
                key={choice.id}
                className={buttonClass}
                onClick={() => setSelectedId(choice.id)}
                disabled={feedbackMode}
              >
                <span className="font-bold mr-3 text-[10px] px-1.5 py-0.5 rounded bg-white/50 border border-black/10 uppercase">
                  {choice.id}
                </span>
                {choice.text}
              </button>
            );
          })}
        </div>

        {feedbackMode && (
          <div className="animate-fade-in mb-6">
            <div
              className={`flex flex-col gap-2 p-4 md:p-5 rounded-lg border ${
                isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-base text-green-700">Correct!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-base text-red-700">Incorrect</span>
                  </>
                )}
              </div>
              {currentFeedback && (
                <div>
                  <h4 className="font-semibold text-xs text-gray-900 mb-1 opacity-80 uppercase tracking-wider">Explanation</h4>
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{currentFeedback}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          {!feedbackMode ? (
            <button
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg active:bg-indigo-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-sm"
              onClick={handleCheck}
              disabled={!selectedId}
            >
              Check Answer
            </button>
          ) : (
            !isCorrect && (
              <button
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors"
                onClick={handleRetry}
              >
                Retry
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
