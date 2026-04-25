"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { QuestionDTO } from "./QuestionManagement";

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string | null, payload: Partial<QuestionDTO>) => Promise<void>;
  initialData?: QuestionDTO | null;
}

export default function QuestionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: QuestionFormModalProps) {
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState("multiple_choice");
  const [newFeedbackCorrect, setNewFeedbackCorrect] = useState("Correct!");
  const [newFeedbackIncorrect, setNewFeedbackIncorrect] = useState("Incorrect. Try again!");
  const [choices, setChoices] = useState<{ id: string; text: string; is_correct: boolean }[]>([
    { id: "1", text: "", is_correct: true },
    { id: "2", text: "", is_correct: false },
  ]);

  useEffect(() => {
    if (initialData) {
      setNewText(initialData.text);
      setNewType(initialData.type);
      setNewFeedbackCorrect(initialData.feedback.correct);
      setNewFeedbackIncorrect(initialData.feedback.incorrect);
      setChoices(initialData.choices);
    } else {
      setNewText("");
      setNewType("multiple_choice");
      setNewFeedbackCorrect("Correct!");
      setNewFeedbackIncorrect("Incorrect. Try again!");
      setChoices([
        { id: "1", text: "", is_correct: true },
        { id: "2", text: "", is_correct: false },
      ]);
    }
  }, [initialData, isOpen]);

  const handleAddChoice = () => {
    if (choices.length >= 4) return;
    setChoices([...choices, { id: Date.now().toString(), text: "", is_correct: false }]);
  };

  const handleRemoveChoice = (id: string) => {
    setChoices(choices.filter(c => c.id !== id));
  };

  const handleChoiceChange = (id: string, text: string, isCorrect: boolean) => {
    setChoices(choices.map(c => {
      if (c.id === id) return { ...c, text, is_correct: isCorrect };
      if (isCorrect && newType === "multiple_choice") return { ...c, is_correct: false };
      return c;
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const correctCount = choices.filter(c => c.is_correct).length;
    if (correctCount !== 1) {
      alert("Please select exactly one correct answer.");
      return;
    }

    const payload = {
      text: newText,
      type: newType,
      choices: choices.map(({ text, is_correct }) => ({ id: "", text, is_correct })),
      feedback: {
        correct: newFeedbackCorrect,
        incorrect: newFeedbackIncorrect
      }
    };

    try {
      await onSubmit(initialData?.id || null, payload);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${initialData ? "update" : "add"} question`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            <form onSubmit={handleFormSubmit} className="flex flex-col max-h-[90vh]">
              <div className="p-8 overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-900">{initialData ? "Edit Question" : "Add Question"}</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {initialData ? "Refine question content or choices." : "Create a new challenge for students."}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Question Content</label>
                    <textarea
                      required
                      rows={3}
                      className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm"
                      placeholder="Enter your question text here..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Answer Choices</label>
                      <button
                        type="button"
                        onClick={handleAddChoice}
                        disabled={choices.length >= 4}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 flex items-center gap-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Add Choice
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {choices.map((choice, idx) => (
                        <div 
                          key={choice.id} 
                          className={cn(
                            "flex items-center gap-4 p-3 rounded-2xl border transition-all",
                            choice.is_correct 
                              ? "border-emerald-500 bg-emerald-50/30" 
                              : "bg-slate-50 border-slate-200"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => handleChoiceChange(choice.id, choice.text, !choice.is_correct)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 group",
                              choice.is_correct 
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                                : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                            )}
                            title={choice.is_correct ? "Correct Answer" : "Mark as Correct"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>

                          <input 
                            required
                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder-slate-400"
                            placeholder={`Choice ${idx + 1}...`}
                            value={choice.text}
                            onChange={(e) => handleChoiceChange(choice.id, e.target.value, choice.is_correct)}
                          />

                          <button 
                            type="button"
                            onClick={() => handleRemoveChoice(choice.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correct Feedback</label>
                      <textarea 
                        rows={3}
                        className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white transition-all shadow-sm"
                        placeholder="Feedback for correct answer..."
                        value={newFeedbackCorrect}
                        onChange={(e) => setNewFeedbackCorrect(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Incorrect Feedback</label>
                      <textarea 
                        rows={3}
                        className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm bg-white transition-all shadow-sm"
                        placeholder="Feedback for incorrect answer..."
                        value={newFeedbackIncorrect}
                        onChange={(e) => setNewFeedbackIncorrect(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  {initialData ? "Update Question" : "Save Question"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
