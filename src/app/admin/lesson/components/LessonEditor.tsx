'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { toast } from 'sonner';
import { updateLesson } from '../actions';
import LessonRenderer from '@/app/lesson/components/LessonRenderer';

interface LessonEditorProps {
    lesson: {
        lesson_id: string;
        title: string;
        content: string;
        order_index: number;
    };
    categoryTitle: string;
}

export default function LessonEditor({ lesson, categoryTitle }: LessonEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState(lesson.title);
    const [content, setContent] = useState(lesson.content || "");
    const [orderIndex, setOrderIndex] = useState(lesson.order_index);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [view, setView] = useState<'edit' | 'preview' | 'split'>('split');

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await updateLesson(lesson.lesson_id, {
                title,
                content,
                order_index: orderIndex
            });
            toast.success("Lesson updated successfully");
        } catch (error) {
            console.error("Failed to update lesson:", error);
            toast.error("Failed to update lesson");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-900 text-lg leading-none">{title || "Untitled Lesson"}</h1>
                        <p className="text-xs text-slate-500 mt-1">In {categoryTitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-200 p-1 rounded-lg">
                        <button
                            onClick={() => setView('edit')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${view === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setView('split')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${view === 'split' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Split
                        </button>
                        <button
                            onClick={() => setView('preview')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${view === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Preview
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Saving...
                            </>
                        ) : "Save"}
                    </button>
                </div>
            </div>

            {/* Inputs Header */}
            <div className="px-8 py-4 border-b border-slate-100 bg-white flex items-center gap-6 flex-shrink-0">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lesson Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Lesson Title"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
                <div className="w-32 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Order Index</label>
                    <input
                        type="number"
                        value={orderIndex}
                        onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Editor Section */}
                {(view === 'edit' || view === 'split') && (
                    <div className={`flex flex-col h-full overflow-hidden bg-slate-50 ${view === 'split' ? 'w-1/2 border-r border-slate-100' : 'w-full'}`}>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <CodeMirror
                                value={content}
                                height="100%"
                                extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
                                onChange={(val) => setContent(val)}
                                theme="light"
                                className="h-full text-sm font-mono leading-relaxed"
                                basicSetup={{
                                    lineNumbers: true,
                                    foldGutter: true,
                                    dropCursor: true,
                                    allowMultipleSelections: true,
                                    indentOnInput: true,
                                    syntaxHighlighting: true,
                                    bracketMatching: true,
                                    closeBrackets: true,
                                    autocompletion: true,
                                    rectangularSelection: true,
                                    crosshairCursor: true,
                                    highlightActiveLine: true,
                                    highlightSelectionMatches: true,
                                    closeBracketsKeymap: true,
                                    defaultKeymap: true,
                                    searchKeymap: true,
                                    historyKeymap: true,
                                    foldKeymap: true,
                                    completionKeymap: true,
                                    lintKeymap: true,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Preview Section */}
                {(view === 'preview' || view === 'split') && (
                    <div className={`flex flex-col h-full bg-white overflow-y-auto custom-scrollbar p-12 ${view === 'split' ? 'w-1/2' : 'w-full'}`}>
                        <div className="max-w-2xl mx-auto w-full">
                            <LessonRenderer content={content} />
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                .cm-editor {
                    height: 100% !important;
                }
                .cm-scroller {
                    font-family: inherit !important;
                }
            `}} />
        </div>
    );
}
