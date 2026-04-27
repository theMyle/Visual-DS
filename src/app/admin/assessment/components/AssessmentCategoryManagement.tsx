"use client";

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export interface AssessmentCategoryDTO {
  id: string;
  category: string;
}

interface AssessmentCategoryManagementProps {
  initialCategories: AssessmentCategoryDTO[];
  onAddCategory: (category: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateCategory: (id: string, category: string) => Promise<void>;
}

export default function AssessmentCategoryManagement({
  initialCategories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
}: AssessmentCategoryManagementProps) {
  const [categories, setCategories] = useState<AssessmentCategoryDTO[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddCategory(newCategory);
      setIsAdding(false);
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("Failed to add category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      setDeletingId(null);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete category.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCategory.trim()) return;
    try {
      await onUpdateCategory(editingId, editCategory);
      setCategories(
        categories.map((c) =>
          c.id === editingId ? { ...c, category: editCategory } : c
        )
      );
      setEditingId(null);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update category.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => { setIsAdding(true); setNewCategory(""); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          Add Category
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">New Category</p>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                autoFocus
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. Array Algorithms"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-slate-900">Assessment Categories</h2>
          <span className="text-xs text-slate-400">{filteredCategories.length} categories</span>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-slate-400 text-sm">
                  {search ? `No categories matching "${search}"` : "No assessment categories yet."}
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <Fragment key={cat.id}>
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {editingId === cat.id ? (
                        <form onSubmit={handleUpdate} className="flex items-center gap-2">
                          <input
                            autoFocus
                            className="px-3 py-1.5 border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                          />
                          <button type="submit" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50">Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100">Cancel</button>
                        </form>
                      ) : (
                        cat.category
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/assessment/${cat.id}/analytics`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Analytics"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                          Analytics
                        </Link>
                        <Link
                          href={`/admin/assessment/${cat.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Manage Questions"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                          Manage
                        </Link>
                        <button
                          onClick={() => { setEditingId(cat.id); setEditCategory(cat.category); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Rename"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(deletingId === cat.id ? null : cat.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Confirm delete */}
                  {deletingId === cat.id && (
                    <tr key={`${cat.id}-delete`} className="bg-red-50">
                      <td colSpan={2} className="px-6 py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-red-700 font-medium">
                            Delete <strong>{cat.category}</strong>? All associated questions will be removed.
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-white transition-colors border border-slate-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              Confirm Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
