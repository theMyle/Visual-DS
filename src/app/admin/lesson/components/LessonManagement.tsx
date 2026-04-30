'use client';

import { useState, Fragment } from 'react';
import { toast } from 'sonner';
import CategoryEditModal from './CategoryEditModal';
import CategoryCreateModal from './CategoryCreateModal';
import LessonCreateModal from './LessonCreateModal';
import { deleteLessonCategory, deleteLesson } from '../actions';
import Link from 'next/link';

export interface SubLessonDTO {
    lesson_id: string;
    slug: string;
    title: string;
    content: string;
    order_index: number;
}

export interface LessonCategoryDTO {
    category_id: string;
    slug: string;
    title: string;
    description: string;
    order_index: number;
    lesson_count: number;
}

// Category with its lessons
export interface FullCategoryDTO extends LessonCategoryDTO {
    lessons: SubLessonDTO[];
}

interface LessonManagementProps {
    categories: FullCategoryDTO[];
}

export default function LessonManagement({ categories: initialCategories }: LessonManagementProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<FullCategoryDTO | null>(null);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [creatingLessonCategory, setCreatingLessonCategory] = useState<FullCategoryDTO | null>(null);
    const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

    const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteLessonCategory(id);
            setDeletingId(null);
            toast.success("Category deleted successfully");
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Failed to delete category");
        }
    };

    const handleDeleteLesson = async (id: string) => {
        try {
            await deleteLesson(id);
            setDeletingLessonId(null);
            toast.success("Lesson deleted successfully");
        } catch (error) {
            console.error("Failed to delete lesson:", error);
            toast.error("Failed to delete lesson");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="font-semibold text-slate-900">Lesson Categories</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{initialCategories.length} categories · {initialCategories.reduce((a, s) => a + s.lesson_count, 0)} total lessons</p>
                </div>
                <button
                    onClick={() => setCreatingCategory(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:scale-[0.98]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    New Category
                </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 min-h-0 overscroll-contain">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-8"></th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lessons</th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {initialCategories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                                    No lesson categories found.
                                </td>
                            </tr>
                        )}

                        {initialCategories.map((cat) => {
                            const isExpanded = expandedId === cat.category_id;
                            const isDeleting = deletingId === cat.category_id;

                            return (
                                <Fragment key={cat.category_id}>
                                    <tr
                                        onClick={() => toggle(cat.category_id)}
                                        className={`transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="pl-6 py-4 pr-0">
                                            <button className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded">
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
                                                    <path d="m9 18 6-6-6-6" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-slate-900">{cat.title}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {cat.slug}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-slate-600 font-medium">{cat.lesson_count}</span>
                                        </td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setCreatingLessonCategory(cat)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                                    Lesson
                                                </button>
                                                <button
                                                    onClick={() => setEditingCategory(cat)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(isDeleting ? null : cat.category_id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {isDeleting && (
                                        <tr className="bg-red-50">
                                            <td colSpan={5} className="px-6 py-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-red-700 font-medium">
                                                        Delete <strong>{cat.title}</strong>? This will remove all lessons in this category.
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setDeletingId(null)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-white transition-colors border border-slate-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(cat.category_id)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                                        >
                                                            Confirm Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={5} className="px-6 pt-0 pb-4 bg-slate-50">
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
                                                            {cat.lessons.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">
                                                                        No lessons yet.
                                                                    </td>
                                                                </tr>
                                                            ) : cat.lessons.map((lesson) => (
                                                                <tr key={lesson.lesson_id} className="bg-white hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-2.5 text-slate-400 font-mono">{lesson.order_index}</td>
                                                                    <td className="px-4 py-2.5 text-slate-800 font-medium">{lesson.title}</td>
                                                                    <td className="px-4 py-2.5 text-slate-500 font-mono">{lesson.slug}</td>
                                                                    <td className="px-4 py-2.5 text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            {deletingLessonId === lesson.lesson_id ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] font-bold text-red-600 uppercase">Delete?</span>
                                                                                    <button
                                                                                        onClick={() => handleDeleteLesson(lesson.lesson_id)}
                                                                                        className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                                                                                    >
                                                                                        Yes
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setDeletingLessonId(null)}
                                                                                        className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-300"
                                                                                    >
                                                                                        No
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    <Link
                                                                                        href={`/admin/lesson/${lesson.lesson_id}`}
                                                                                        className="text-slate-500 hover:text-indigo-600 transition-colors p-1"
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                                                    </Link>
                                                                                    <button
                                                                                        onClick={() => setDeletingLessonId(lesson.lesson_id)}
                                                                                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                                                                                    </button>
                                                                                </>
                                                                            )}
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
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {creatingCategory && (
                <CategoryCreateModal
                    onClose={() => setCreatingCategory(false)}
                />
            )}

            {editingCategory && (
                <CategoryEditModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                />
            )}

            {creatingLessonCategory && (
                <LessonCreateModal
                    category={creatingLessonCategory}
                    onClose={() => setCreatingLessonCategory(null)}
                />
            )}
        </div>
    );
}
