"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { QuestionDTO } from "./QuestionManagement";

interface AssessmentAnalyticsProps {
  category: string;
  questions: QuestionDTO[];
}

export default function AssessmentAnalytics({ category, questions }: AssessmentAnalyticsProps) {
  const [filter, setFilter] = useState<"all" | "hard" | "easy" | "balanced">("all");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const stats = useMemo(() => {
    let totalCorrect = 0;
    let totalMistakes = 0;
    
    const questionsWithRates = questions.map(q => {
      const correct = q.stats?.correct || 0;
      const mistakes = q.stats?.mistakes || 0;
      const total = correct + mistakes;
      const rate = total > 0 ? (correct / total) * 100 : 100;
      
      let difficulty: "Easy" | "Balanced" | "Hard" | "New" = "New";
      if (total >= 5) {
        if (rate > 80) difficulty = "Easy";
        else if (rate < 40) difficulty = "Hard";
        else difficulty = "Balanced";
      }

      return { ...q, rate, total, difficulty };
    });

    questionsWithRates.forEach(q => {
      totalCorrect += q.stats?.correct || 0;
      totalMistakes += q.stats?.mistakes || 0;
    });

    const overallRate = (totalCorrect + totalMistakes) > 0 
      ? (totalCorrect / (totalCorrect + totalMistakes)) * 100 
      : 0;

    return {
      questionsWithRates,
      overallRate,
      totalAttempts: totalCorrect + totalMistakes,
      hardest: [...questionsWithRates].filter(q => q.total >= 5).sort((a, b) => a.rate - b.rate)[0],
      easiest: [...questionsWithRates].filter(q => q.total >= 5).sort((a, b) => b.rate - a.rate)[0]
    };
  }, [questions]);

  const filteredQuestions = stats.questionsWithRates.filter(q => {
    if (filter === "all") return true;
    return q.difficulty.toLowerCase() === filter;
  });

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      {/* Top Bar with Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          {(["all", "hard", "balanced", "easy"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === t 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowBreakdown(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-indigo-600 transition-colors"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Analytics Guide
        </button>
      </div>

      {/* Analytics Guide Modal Overlay */}
      {showBreakdown && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBreakdown(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
          >
            <div className="p-8 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">Analytics Guide</h2>
                <p className="text-slate-500 text-sm mt-1">Understanding our Item Analysis methodology.</p>
              </div>

              <div className="space-y-10">
                {/* Section 1: Metrics */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Success Metrics</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Individual question performance is calculated by measuring the ratio of correct selections against the total interaction count.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Formula</span>
                    <code className="text-sm font-bold text-slate-900">
                      (Correct / Total Responses) × 100
                    </code>
                  </div>
                </section>

                {/* Section 2: Difficulty */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Difficulty Thresholds</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Easy Category</p>
                        <p className="text-xs text-slate-500 mt-0.5">Success rate exceeds 80%. High student proficiency or potential for more challenging distractors.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Balanced Category</p>
                        <p className="text-xs text-slate-500 mt-0.5">Success rate between 40% and 80%. Represents optimal learning challenge.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Hard Category</p>
                        <p className="text-xs text-slate-500 mt-0.5">Success rate falls below 40%. May indicate complex concepts or potential item ambiguity.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Reliability */}
                <section className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-slate-400 italic">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <p className="text-xs font-medium">To ensure statistical significance, a minimum of 5 responses is required before difficulty categorization is applied.</p>
                  </div>
                </section>
              </div>

              <div className="mt-10 flex justify-end pb-2">
                <button 
                  onClick={() => setShowBreakdown(false)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Question Content</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Success Rate</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Analytics</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 max-w-xl">
                    <p className="text-[15px] font-normal text-slate-900 leading-relaxed whitespace-pre-wrap">{q.text}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border-2 ${
                      q.difficulty === "Easy" ? "bg-emerald-100 border-emerald-200 text-emerald-900" :
                      q.difficulty === "Hard" ? "bg-rose-100 border-rose-200 text-rose-900" :
                      q.difficulty === "Balanced" ? "bg-indigo-100 border-indigo-200 text-indigo-900" :
                      "bg-slate-100 border-slate-200 text-slate-600"
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{q.rate.toFixed(1)}%</span>
                      <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            q.rate > 80 ? 'bg-emerald-600' : 
                            q.rate < 40 ? 'bg-rose-600' : 
                            'bg-indigo-600'
                          }`}
                          style={{ width: `${q.rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-left">
                    <div className="flex flex-col items-start gap-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 w-32">
                        <span className="flex-1">Correct:</span>
                        <span className="text-sm">{q.stats?.correct || 0}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100 w-32">
                        <span className="flex-1">Mistakes:</span>
                        <span className="text-sm">{q.stats?.mistakes || 0}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
