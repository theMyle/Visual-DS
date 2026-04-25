'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface SimulatorChallengeItem {
    id: string;
    slug: string;
    title: string;
    order_index: number;
    path: string;
}

export interface SimulatorCategoryDTO {
    id: string;
    slug: string;
    name: string;
    challenges: SimulatorChallengeItem[];
}

interface SimulatorManagementProps {
    simulators: SimulatorCategoryDTO[];
}

export default function SimulatorManagement({ simulators }: SimulatorManagementProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="font-semibold text-slate-900">Simulator Categories</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{simulators.length} categories · {simulators.reduce((a, s) => a + s.challenges.length, 0)} total challenges</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                    <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-8"></th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Challenges</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {simulators.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                                No simulator categories found.
                            </td>
                        </tr>
                    )}

                    {simulators.map((sim) => {
                        const isExpanded = expandedId === sim.id;
                        const isDeleting = deletingId === sim.id;

                        return (
                            <>
                                <tr
                                    key={sim.id}
                                    className={`transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                >
                                    {/* Expand toggle */}
                                    <td className="pl-6 py-4 pr-0">
                                        <button
                                            onClick={() => toggle(sim.id)}
                                            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded"
                                            title={isExpanded ? 'Collapse' : 'View challenges'}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16" height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                            >
                                                <path d="m9 18 6-6-6-6"/>
                                            </svg>
                                        </button>
                                    </td>

                                    {/* Name */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-900">{sim.name}</span>
                                    </td>

                                    {/* Challenge count */}
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-slate-600 font-medium">{sim.challenges.length}</span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Edit */}
                                            <button
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                Edit
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => setDeletingId(isDeleting ? null : sim.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Confirm delete row */}
                                {isDeleting && (
                                    <tr key={`${sim.id}-delete`} className="bg-red-50">
                                        <td colSpan={4} className="px-6 py-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-red-700 font-medium">
                                                    Delete <strong>{sim.name}</strong>? This will remove all {sim.challenges.length} challenge(s).
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setDeletingId(null)}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-white transition-colors border border-slate-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                                                        Confirm Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Expanded challenges */}
                                {isExpanded && (
                                    <tr key={`${sim.id}-expanded`}>
                                        <td colSpan={4} className="px-6 pt-0 pb-4 bg-slate-50">
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="bg-white border-b border-slate-100">
                                                            <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wider">#</th>
                                                            <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                                                            <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wider">Slug</th>
                                                            <th className="text-right px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {sim.challenges.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">
                                                                    No challenges yet.
                                                                </td>
                                                            </tr>
                                                        ) : sim.challenges.map((c) => (
                                                            <tr key={c.id} className="bg-white hover:bg-slate-50 transition-colors">
                                                                <td className="px-4 py-2.5 text-slate-400 font-mono">{c.order_index}</td>
                                                                <td className="px-4 py-2.5 text-slate-800 font-medium">{c.title}</td>
                                                                <td className="px-4 py-2.5 text-slate-500 font-mono">{c.slug}</td>
                                                                <td className="px-4 py-2.5 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button className="text-slate-500 hover:text-slate-800 transition-colors">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                                        </button>
                                                                        <Link
                                                                            href={c.path}
                                                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                                                            title="Preview"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                                        </Link>
                                                                        <button className="text-slate-400 hover:text-red-600 transition-colors">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </div>
    );
}
