import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../components/AdminSidebar";
import AssessmentCategoryManagement, { AssessmentCategoryDTO } from "./components/AssessmentCategoryManagement";
import { revalidatePath } from "next/cache";

export default async function AdminAssessmentPage() {
    const { getToken } = await auth();
    
    let categories: AssessmentCategoryDTO[] = [];
    let error: string | null = null;

    try {
        categories = await fetchAdminApi<AssessmentCategoryDTO[]>("assessments", getToken);
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to fetch assessment categories";
        console.error("Admin Assessment Categories Fetch Error:", e);
    }

    async function addCategory(category: string) {
        "use server";
        const { getToken } = await auth();
        
        // Simple slugify for the ID
        const id = category.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        
        await fetchAdminApi("assessments", getToken, {
            method: "POST",
            body: JSON.stringify({
                id,
                category,
                questions: []
            })
        });
        
        revalidatePath("/admin/assessment");
    }

    async function deleteCategory(id: string) {
        "use server";
        const { getToken } = await auth();
        
        await fetchAdminApi(`assessments/${id}`, getToken, {
            method: "DELETE"
        });
        
        revalidatePath("/admin/assessment");
    }

    async function updateCategory(id: string, category: string) {
        "use server";
        const { getToken } = await auth();
        
        await fetchAdminApi(`assessments/${id}`, getToken, {
            method: "PUT",
            body: JSON.stringify({ category })
        });
        
        revalidatePath("/admin/assessment");
    }

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            {/* Left Sidebar */}
            <AdminSidebar />

            {/* Right Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden">
                    <header className="mb-8 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-slate-900">Assessments</h1>
                        <p className="text-slate-500 mt-2">Manage assessment categories and their corresponding questions.</p>
                    </header>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden">
                            <AssessmentCategoryManagement 
                                initialCategories={categories} 
                                onAddCategory={addCategory}
                                onDeleteCategory={deleteCategory}
                                onUpdateCategory={updateCategory}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
