'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateLessonCategory } from '../actions';
import { FullCategoryDTO } from './LessonManagement';

interface CategoryEditModalProps {
    category: FullCategoryDTO;
    onClose: () => void;
}

export default function CategoryEditModal({ category, onClose }: CategoryEditModalProps) {
    const [title, setTitle] = useState(category.title);
    const [slug, setSlug] = useState(category.slug);
    const [description, setDescription] = useState(category.description || "");
    const [orderIndex, setOrderIndex] = useState(category.order_index);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTitle(category.title);
        setSlug(category.slug);
        setDescription(category.description || "");
        setOrderIndex(category.order_index);
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateLessonCategory(category.category_id, {
                title,
                slug,
                description,
                order_index: orderIndex
            });
            toast.success("Category updated successfully");
            onClose();
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("Failed to update category");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg">Edit Category</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Slug</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Order Index</label>
                        <input
                            type="number"
                            required
                            value={orderIndex}
                            onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
