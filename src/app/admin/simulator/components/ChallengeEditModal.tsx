'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { fetchChallenge } from '../actions';

interface ChallengeEditModalProps {
    challengeId: string;
    simulatorName: string;
    onClose: () => void;
    onSave: (id: string, data: any) => Promise<void>;
}

export default function ChallengeEditModal({ challengeId, simulatorName, onClose, onSave }: ChallengeEditModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [orderIndex, setOrderIndex] = useState(1);
    const [initialCode, setInitialCode] = useState("");

    // Combined JSON config
    const [challengeConfig, setChallengeConfig] = useState('{}');
    const [isActive, setIsActive] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'code' | 'config'>('general');

    useEffect(() => {
        const loadChallenge = async () => {
            try {
                const data = await fetchChallenge(challengeId);
                console.log(data)
                setTitle(data.title || "");
                setSlug(data.slug || "");
                setDescription(data.description || "");
                setOrderIndex(data.order_index ?? 1);
                setInitialCode(data.initial_code || "");
                const config = {
                    program_structure: data.program_structure || {},
                    test_cases: data.test_cases || [],
                    capacity: data.capacity || {}
                };
                setChallengeConfig(formatJsonString(JSON.stringify(config)));
                setIsActive(data.is_active ?? true);
            } catch (error) {
                console.error("Failed to fetch challenge:", error);
                toast.error("Failed to load challenge details");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        loadChallenge();
    }, [challengeId, onClose]);

    const formatJsonString = (val: string) => {
        try {
            const parsed = JSON.parse(val);
            // Custom stringifier to keep simple arrays horizontal
            const json = JSON.stringify(parsed, null, 2);
            // Flatten arrays of primitives (numbers, strings, booleans)
            return json.replace(/\[\n\s+([\d\s,."'-]*)\n\s+\]/g, (match, p1) => {
                return `[ ${p1.replace(/\s+/g, ' ').trim()} ]`;
            });
        } catch (e) {
            return val;
        }
    };

    const formatJson = (val: string, setter: (v: string) => void) => {
        if (!val.trim()) return;
        setter(formatJsonString(val));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate JSON field
        let parsedConfig;
        try {
            parsedConfig = JSON.parse(challengeConfig);
        } catch (err) {
            toast.error("Invalid JSON in configuration field");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(challengeId, {
                slug,
                title,
                description,
                order_index: Number(orderIndex),
                initial_code: initialCode,
                program_structure: parsedConfig.program_structure || {},
                test_cases: parsedConfig.test_cases || [],
                capacity: parsedConfig.capacity || {},
                is_active: isActive
            });
            onClose();
        } catch (error) {
            console.error("Failed to update challenge:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Loading challenge details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col h-[85vh] max-h-[900px]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Edit Challenge</h3>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{simulatorName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-[200px] border-r border-slate-100 bg-slate-50/30 p-4 flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'code' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                            Initial Code
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                            JSON Config
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-white">
                        <form id="edit-challenge-form" onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-3xl mx-auto">
                            {activeTab === 'general' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Challenge Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                                placeholder="e.g. Reverse a Stack"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Challenge Slug</label>
                                            <input
                                                type="text"
                                                required
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono shadow-sm"
                                                placeholder="e.g. reverse-stack"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 items-end">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Order Index</label>
                                            <input
                                                type="number"
                                                required
                                                value={orderIndex}
                                                onChange={(e) => setOrderIndex(Number(e.target.value))}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={isActive}
                                                    onChange={(e) => setIsActive(e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                <span className="ml-3 text-sm font-bold text-slate-600">Active Status</span>
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 italic -mt-4 ml-1">Position in the curriculum (lower numbers appear first).</p>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm leading-relaxed"
                                            placeholder="Master the fundamentals of stack manipulation..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'code' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-4 flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Initial Solution Template</label>
                                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">JavaScript</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group min-h-[400px]">
                                        <div className="absolute top-0 left-0 w-full h-8 bg-[#252526] border-b border-[#333] flex items-center px-4 gap-2 z-10">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                            </div>
                                            <div className="ml-4 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                solution.js
                                            </div>
                                        </div>
                                        <textarea
                                            value={initialCode}
                                            onChange={(e) => setInitialCode(e.target.value)}
                                            className="flex-1 w-full mt-8 p-6 font-mono text-sm text-[#d4d4d4] bg-[#1e1e1e] outline-none resize-none whitespace-pre overflow-x-auto leading-relaxed custom-scrollbar selection:bg-indigo-500/30 code-textarea"
                                            spellCheck={false}
                                            placeholder="function Solution(datastructure, io) {\n  // Your code here\n}"
                                        />
                                        <div className="absolute left-0 top-8 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#333] pointer-events-none flex flex-col items-center pt-6 text-[#858585] font-mono text-[11px] select-none">
                                            {Array.from({ length: 40 }).map((_, i) => (
                                                <div key={i} className="leading-relaxed h-[21px]">{i + 1}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'config' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-4 flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Challenge Configuration (JSON)</label>
                                    </div>
                                    <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group min-h-[500px]">
                                        <div className="absolute top-0 left-0 w-full h-8 bg-[#252526] border-b border-[#333] flex items-center px-4 gap-2 z-20">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                            </div>
                                            <div className="ml-4 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                                config.json
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-auto mt-8">
                                            <CodeMirror
                                                value={challengeConfig}
                                                height="100%"
                                                theme="dark"
                                                extensions={[javascript()]}
                                                onChange={(val) => setChallengeConfig(val)}
                                                onBlur={() => formatJson(challengeConfig, setChallengeConfig)}
                                                className="text-sm font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #1e1e1e;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #333;
                        border: 2px solid #1e1e1e;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #444;
                    }
                    .code-textarea {
                        padding-left: 64px !important;
                    }
                `}</style>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${activeTab === 'general' ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${activeTab === 'code' ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${activeTab === 'config' ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            form="edit-challenge-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
