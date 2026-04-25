"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  onUpdateCategory
}: AssessmentCategoryManagementProps) {
  const [categories, setCategories] = useState<AssessmentCategoryDTO[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");

  const filteredCategories = categories.filter(cat => 
    cat.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;

    setIsSubmitting(true);
    try {
      await onAddCategory(newCategory);
      setIsAdding(false);
      setNewCategory("");
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Failed to add category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All associated questions will be deleted.")) return;
    
    try {
      await onDeleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete category.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCategory) return;

    try {
      await onUpdateCategory(editingId, editCategory);
      setCategories(categories.map(c => c.id === editingId ? { ...c, category: editCategory } : c));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update category.");
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Category
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-50/50"
          >
            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Category Name (ID will be auto-generated)</label>
                <input
                  type="text"
                  required
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full"
                  placeholder="e.g. Array Algorithms"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
                >
                  {isSubmitting ? "Creating..." : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">Assessment Category</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">Questions</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                      {editingId === cat.id ? (
                        <form onSubmit={handleUpdate} className="flex items-center gap-2">
                          <input 
                            autoFocus
                            className="px-2 py-1 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                          />
                          <button type="submit" className="text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-tight">Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-tight">Cancel</button>
                        </form>
                      ) : (
                        <span>{cat.category}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link 
                        href={`/admin/assessment/${cat.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-lg font-bold text-xs transition-all"
                      >
                        Manage Questions
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditCategory(cat.category);
                          }}
                          title="Edit Category Name"
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          title="Delete Category"
                          className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                      </div>
                      <p className="text-slate-500 font-medium">No assessment categories found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
