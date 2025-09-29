"use client";

import { useState } from "react";
import Assessment from "../components/Assessment";
import ProgressDots from "../components/ProgressDots";

// Type definitions for assessment structure
interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Explanation {
  correct: string;   // Explanation shown when answer is correct
  incorrect: string; // Explanation shown when answer is wrong
}

interface Visualization {
  type: 'array' | 'image' | 'code' | 'diagram';
  data?: any; // For array visualizations
  src?: string; // For images
  content?: string; // For code or text content
}

interface Question {
  id: string;
  question: string;
  explanation: Explanation;
  choices: [Choice, Choice, Choice, Choice]; // Exactly 4 choices
  visualization?: Visualization; // Optional visualization
}

interface AssessmentProps {
  questions: Question[];
  title?: string;
  onComplete?: (score: number, totalQuestions: number) => void;
}

interface AssessmentState {
  currentQuestionIndex: number;
  selectedAnswerId: string | null;
  showExplanation: boolean;
  correctAnswers: number;
  answeredQuestions: boolean[];
}

export default function arrayListAssessment() {
  const [finished, setFinished] = useState(false);
  const total = 10;
  const [current, setCurrent] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correct, setCorrect] = useState<boolean[]>(() => Array(total).fill(false));

  const isLastItem = () => {
    if (current == total - 1) {
      setFinished(true);
      return true;
    }

    return false;
  }

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

  const handleWrong = () => {
    setCurrent(c => c += 1);
    setAnsweredCount(c => c += 1);

    if (isLastItem()) return;
  }

  return (
    <>
      <ProgressDots
        current={current}
        total={total}
        answeredCount={answeredCount}
        correct={correct}
      ></ProgressDots>

      {finished ?
        <h1>Done</h1>
        :
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-300 border-1 p-2 rounded-xl active:bg-blue-400" onClick={() => { handleCorrect() }}>Correct</button>
          <button className="bg-blue-300 border-1 p-2 rounded-xl active:bg-blue-400" onClick={() => { handleWrong() }}>Wrong</button>
        </div>
      }
    </>
  )
}