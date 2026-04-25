"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuestionDTO {
  id: string;
  text: string;
  type: string;
  image_url?: string;
  choices: {
    id: string;
    text: string;
    is_correct: boolean;
  }[];
  feedback: {
    correct: string;
    incorrect: string;
  };
}

interface QuestionManagementProps {
  assessmentId: string;
  initialQuestions: QuestionDTO[];
  onAddQuestion: (question: Partial<QuestionDTO>) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
}

export default function QuestionManagement({
  assessmentId,
  initialQuestions,
  onAddQuestion,
  onDeleteQuestion
}: QuestionManagementProps) {
  const [questions, setQuestions] = useState<QuestionDTO[]>(initialQuestions);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // New Question Form State
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState("multiple_choice");
  const [newFeedbackCorrect, setNewFeedbackCorrect] = useState("Correct!");
  const [newFeedbackIncorrect, setNewFeedbackIncorrect] = useState("Incorrect. Try again!");
  const [choices, setChoices] = useState([
    { id: "1", text: "", is_correct: true },
    { id: "2", text: "", is_correct: false },
  ]);

  const filteredQuestions = questions.filter(q =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddChoice = () => {
    setChoices([...choices, { id: Date.now().toString(), text: "", is_correct: false }]);
  };

  const handleRemoveChoice = (id: string) => {
    setChoices(choices.filter(c => c.id !== id));
  };

  const handleChoiceChange = (id: string, text: string, isCorrect: boolean) => {
    setChoices(choices.map(c => {
      if (c.id === id) return { ...c, text, is_correct: isCorrect };
      // If setting this to correct, unset others if it's multiple choice
      if (isCorrect && newType === "multiple_choice") return { ...c, is_correct: false };
      return c;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await onAddQuestion(payload);
      // For simplicity, just refresh or let server revalidate
      setIsAdding(false);
      setNewText("");
    } catch (error) {
      alert("Failed to add question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await onDeleteQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      alert("Failed to delete question");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Question
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-xl shadow-indigo-50/50 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Question Text</label>
                    <textarea 
                      required
                      rows={3}
                      className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="What is the time complexity of..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Feedback (Correct)</label>
                    <input 
                      className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={newFeedbackCorrect}
                      onChange={(e) => setNewFeedbackCorrect(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Feedback (Incorrect)</label>
                    <input 
                      className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={newFeedbackIncorrect}
                      onChange={(e) => setNewFeedbackIncorrect(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Choices</label>
                    <button 
                      type="button" 
                      onClick={handleAddChoice}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Choice
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto p-1">
                    {choices.map((choice) => (
                      <div key={choice.id} className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          checked={choice.is_correct}
                          onChange={(e) => handleChoiceChange(choice.id, choice.text, e.target.checked)}
                        />
                        <input 
                          required
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          placeholder="Choice text..."
                          value={choice.text}
                          onChange={(e) => handleChoiceChange(choice.id, e.target.value, choice.is_correct)}
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveChoice(choice.id)}
                          className="text-slate-300 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Save Question
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-auto pr-2 space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => (
            <motion.div 
              layout
              key={q.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-colors shadow-sm group relative"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">Question {idx + 1}</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{q.id}</span>
                  </div>
                  <h3 className="text-slate-800 font-bold mb-4">{q.text}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.choices.map((choice) => (
                      <div 
                        key={choice.id} 
                        className={cn(
                          "px-4 py-3 rounded-xl border text-sm flex items-center gap-3",
                          choice.is_correct 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                            : "bg-slate-50 border-slate-100 text-slate-600"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center border",
                          choice.is_correct ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                        )}>
                          {choice.is_correct && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        {choice.text}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No questions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
