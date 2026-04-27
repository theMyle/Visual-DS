'use client';

import { useState, useEffect } from 'react';
import { SimulatorCategoryDTO } from './SimulatorManagement';

interface SimulatorEditModalProps {
    simulator: SimulatorCategoryDTO | null;
    onClose: () => void;
    onSave: (id: string, data: { name: string, slug: string, description: string, initialCode: string, isActive: boolean }) => Promise<void>;
}

export default function SimulatorEditModal({ simulator, onClose, onSave }: SimulatorEditModalProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [initialCode, setInitialCode] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (simulator) {
            setName(simulator.name);
            setSlug(simulator.slug);
            setDescription(simulator.description || "");
            setInitialCode(simulator.initial_code || "");
            setIsActive(simulator.is_active);
        }
    }, [simulator]);

    if (!simulator) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(simulator.id, { name, slug, description, initialCode, isActive });
            onClose();
        } catch (error) {
            console.error("Failed to save simulator:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col h-[85vh] max-h-[900px]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="m8 17 4 4 4-4"/><path d="m8 7 4-4 4 4"/></svg>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Edit Simulator Category</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
                    {/* Left Side: Metadata & Settings */}
                    <div className="w-[380px] p-8 border-r border-slate-100 overflow-y-auto flex flex-col gap-8 bg-slate-50/30">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm"
                                    placeholder="e.g. Tree Structures"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono bg-white shadow-sm"
                                    placeholder="e.g. tree"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none bg-white shadow-sm leading-relaxed"
                                    placeholder="Briefly describe this simulator category..."
                                />
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Visibility</p>
                                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Show this category to all students.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsActive(!isActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500 ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Global Code Editor */}
                    <div className="flex-1 p-8 flex flex-col gap-4 bg-slate-100/50">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Initial Code (Global)</label>
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">JavaScript</span>
                            </div>
                            <p className="text-[11px] text-slate-400 italic">This code is prepended to challenge-specific logic.</p>
                        </div>
                        
                        <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-8 bg-[#252526] border-b border-[#333] flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="ml-4 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    globals.js
                                </div>
                            </div>
                            <textarea
                                value={initialCode}
                                onChange={(e) => setInitialCode(e.target.value)}
                                className="flex-1 w-full mt-8 p-6 font-mono text-sm text-[#d4d4d4] bg-[#1e1e1e] outline-none resize-none whitespace-pre overflow-x-auto leading-relaxed custom-scrollbar selection:bg-indigo-500/30 code-textarea"
                                spellCheck={false}
                                placeholder="// Write global utility functions or setup code here..."
                            />
                            {/* Lines indicator decor */}
                            <div className="absolute left-0 top-8 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#333] pointer-events-none flex flex-col items-center pt-6 text-[#858585] font-mono text-[11px] select-none">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div key={i} className="leading-relaxed h-[21px]">{i + 1}</div>
                                ))}
                            </div>
                            <style>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 12px;
                                    height: 12px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: #1e1e1e;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #333;
                                    border: 3px solid #1e1e1e;
                                    border-radius: 10px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #444;
                                }
                                .code-textarea {
                                    padding-left: 60px !important;
                                }
                            `}</style>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-4 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
