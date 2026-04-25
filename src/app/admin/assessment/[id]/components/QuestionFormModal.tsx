"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuestionDTO } from "./QuestionManagement";

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string | null, payload: Partial<QuestionDTO>) => Promise<void>;
  initialData?: QuestionDTO | null;
}

const LETTER = ["A", "B", "C", "D"];

export default function QuestionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: QuestionFormModalProps) {
  const [text, setText] = useState("");
  const [type, setType] = useState("multiple_choice");
  const [feedbackCorrect, setFeedbackCorrect] = useState("Correct!");
  const [feedbackIncorrect, setFeedbackIncorrect] = useState("Incorrect. Try again!");
  const [choices, setChoices] = useState<{ id: string; text: string; is_correct: boolean }[]>([
    { id: "1", text: "", is_correct: true },
    { id: "2", text: "", is_correct: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setType(initialData.type);
      setFeedbackCorrect(initialData.feedback.correct);
      setFeedbackIncorrect(initialData.feedback.incorrect);
      setChoices(initialData.choices);
    } else {
      setText("");
      setType("multiple_choice");
      setFeedbackCorrect("Correct!");
      setFeedbackIncorrect("Incorrect. Try again!");
      setChoices([
        { id: "1", text: "", is_correct: true },
        { id: "2", text: "", is_correct: false },
      ]);
    }
  }, [initialData, isOpen]);

  const addChoice = () => {
    if (choices.length >= 4) return;
    setChoices([...choices, { id: Date.now().toString(), text: "", is_correct: false }]);
  };

  const removeChoice = (id: string) => {
    if (choices.length <= 2) return;
    setChoices(choices.filter((c) => c.id !== id));
  };

  const updateChoice = (id: string, text: string, is_correct: boolean) => {
    setChoices(
      choices.map((c) => {
        if (c.id === id) return { ...c, text, is_correct };
        if (is_correct && type === "multiple_choice") return { ...c, is_correct: false };
        return c;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const correctCount = choices.filter((c) => c.is_correct).length;
    if (correctCount !== 1) {
      toast.error("Please select exactly one correct answer.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(initialData?.id || null, {
        text,
        type,
        choices: choices.map(({ text, is_correct }) => ({ id: "", text, is_correct })),
        feedback: { correct: feedbackCorrect, incorrect: feedbackIncorrect },
      });
      onClose();
    } catch {
      toast.error(`Failed to ${initialData ? "update" : "add"} question`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Question" : "New Question"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {initialData ? "Update this question's content and answers." : "Add a new question to this assessment."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

            {/* Question text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Question
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="Enter your question here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Choices */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Answer Choices
                </label>
                <button
                  type="button"
                  onClick={addChoice}
                  disabled={choices.length >= 4}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                  </svg>
                  Add Choice
                </button>
              </div>

              <div className="space-y-2">
                {choices.map((choice, idx) => (
                  <div
                    key={choice.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      choice.is_correct
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {/* Correct toggle */}
                    <button
                      type="button"
                      onClick={() => updateChoice(choice.id, choice.text, !choice.is_correct)}
                      title={choice.is_correct ? "Correct answer" : "Mark as correct"}
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        choice.is_correct
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {choice.is_correct && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>

                    {/* Letter label */}
                    <span className={`text-xs font-bold w-4 flex-shrink-0 ${
                      choice.is_correct ? "text-emerald-600" : "text-slate-400"
                    }`}>
                      {LETTER[idx]}
                    </span>

                    {/* Input */}
                    <input
                      required
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                      placeholder={`Choice ${LETTER[idx]}...`}
                      value={choice.text}
                      onChange={(e) => updateChoice(choice.id, e.target.value, choice.is_correct)}
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeChoice(choice.id)}
                      disabled={choices.length <= 2}
                      className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 disabled:pointer-events-none transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400">
                Click the circle to mark the correct answer. Only one can be correct.
              </p>
            </div>

            {/* Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Feedback
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Correct
                  </p>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all resize-none"
                    placeholder="Shown when answered correctly..."
                    value={feedbackCorrect}
                    onChange={(e) => setFeedbackCorrect(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-red-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    Incorrect
                  </p>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all resize-none"
                    placeholder="Shown when answered incorrectly..."
                    value={feedbackIncorrect}
                    onChange={(e) => setFeedbackIncorrect(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting
                ? (initialData ? "Saving..." : "Adding...")
                : (initialData ? "Save Changes" : "Add Question")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
