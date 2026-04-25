"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import QuestionFormModal from "./QuestionFormModal";

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
  stats?: {
    correct: number;
    mistakes: number;
  };
}

interface QuestionManagementProps {
  assessmentId: string;
  initialQuestions: QuestionDTO[];
  onAddQuestion: (question: Partial<QuestionDTO>) => Promise<void>;
  onUpdateQuestion: (id: string, question: Partial<QuestionDTO>) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
}

export default function QuestionManagement({
  assessmentId,
  initialQuestions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion
}: QuestionManagementProps) {
  const [questions, setQuestions] = useState<QuestionDTO[]>(initialQuestions);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Sync state with props when server refreshes
  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  // Form State
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
    if (choices.length >= 4) return;
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

  const handleEdit = (q: QuestionDTO) => {
    setEditId(q.id);
    setNewText(q.text);
    setNewType(q.type);
    setNewFeedbackCorrect(q.feedback.correct);
    setNewFeedbackIncorrect(q.feedback.incorrect);
    setChoices(q.choices);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setNewText("");
    setNewType("multiple_choice");
    setNewFeedbackCorrect("Correct!");
    setNewFeedbackIncorrect("Incorrect. Try again!");
    setChoices([
      { id: "1", text: "", is_correct: true },
      { id: "2", text: "", is_correct: false },
    ]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (id: string | null, payload: Partial<QuestionDTO>) => {
    try {
      if (id) {
        await onUpdateQuestion(id, payload);
        toast.info("Question updated successfully");
      } else {
        await onAddQuestion(payload);
        toast.success("Question added successfully");
      }
      setIsFormOpen(false);
      setEditId(null);
    } catch (error) {
      throw error; // Let the modal handle the toast error if needed, or handle it here
    }
  };

  const selectedQuestion = editId ? questions.find(q => q.id === editId) : null;

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 px-1 flex-shrink-0">
            <span className="text-xs font-medium text-slate-500">Total questions:</span>
            <span className="text-sm font-bold text-indigo-600">{questions.length}</span>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          Add Question
        </button>
      </div>

      <QuestionFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedQuestion}
      />

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
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{q.id}</span>
                  </div>
                   <h3 className="text-slate-800 font-semibold mb-4 whitespace-pre-wrap">{q.text}</h3>
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
                          {choice.is_correct && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                        </div>
                        <div className="whitespace-pre-wrap">{choice.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-start">
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex-shrink-0"
                    title="Edit Question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                    title="Delete Question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </div>
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
