"use client";

import { useState, useEffect } from "react";
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

// ── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function QuestionManagement({
  assessmentId,
  initialQuestions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: QuestionManagementProps) {
  const [questions, setQuestions] = useState<QuestionDTO[]>(initialQuestions ?? []);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setQuestions(initialQuestions ?? []);
  }, [initialQuestions]);

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (q: QuestionDTO) => {
    setEditId(q.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setConfirmDeleteId(null);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleSubmit = async (id: string | null, payload: Partial<QuestionDTO>) => {
    if (id) {
      await onUpdateQuestion(id, payload);
      toast.success("Question updated");
    } else {
      await onAddQuestion(payload);
      toast.success("Question added");
    }
    setIsFormOpen(false);
    setEditId(null);
  };

  const selectedQuestion = editId ? questions.find((q) => q.id === editId) : null;
  const deleteTarget = confirmDeleteId ? questions.find((q) => q.id === confirmDeleteId) : null;

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{questions.length} questions</span>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Question List */}
      <div className="flex-1 overflow-auto space-y-2 pr-1">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-400 text-sm">
              {search ? `No questions matching "${search}"` : "No questions yet. Add one to get started."}
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            const correctChoice = q.choices.find((c) => c.is_correct);
            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                {/* Question header row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="flex-1 text-sm font-medium text-slate-800 line-clamp-1">{q.text}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {q.choices.length} choices
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(q); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(q.id); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`text-slate-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                {/* Expanded choices */}
                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                          choice.is_correct
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                            : "bg-slate-50 border-slate-100 text-slate-600"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border ${
                          choice.is_correct ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                        }`}>
                          {choice.is_correct && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                        <span className="leading-snug">{choice.text}</span>
                      </div>
                    ))}
                    {(q.feedback.correct || q.feedback.incorrect) && (
                      <div className="col-span-full mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          <span className="font-semibold text-emerald-600 block mb-0.5">Correct feedback</span>
                          {q.feedback.correct}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="font-semibold text-red-500 block mb-0.5">Incorrect feedback</span>
                          {q.feedback.incorrect}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <QuestionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedQuestion}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete question?"
        description={deleteTarget ? `"${deleteTarget.text.slice(0, 80)}${deleteTarget.text.length > 80 ? "…" : ""}"` : "This action cannot be undone."}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
