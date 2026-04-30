import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../components/AdminSidebar";
import LessonManagement, { FullCategoryDTO, LessonCategoryDTO } from "./components/LessonManagement";

export const dynamic = "force-dynamic";

export default async function AdminLessonPage() {
    const { getToken } = await auth();

    let categories: FullCategoryDTO[] = [];
    let error: string | null = null;

    try {
        // 1. Fetch Categories
        const baseCategories = await fetchAdminApi<LessonCategoryDTO[]>("lessons", getToken);
        
        // 2. Fetch Lessons for each category in parallel
        categories = await Promise.all(baseCategories.map(async (cat) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${cat.slug}`, {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    return {
                        ...cat,
                        lessons: data.lessons || []
                    };
                }
            } catch (e) {
                console.error(`Failed to fetch lessons for ${cat.slug}:`, e);
            }
            return {
                ...cat,
                lessons: []
            };
        }));
        
        // Sort categories by order_index
        categories.sort((a, b) => a.order_index - b.order_index);

    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to fetch lesson data";
        console.error("Admin Lesson Fetch Error:", e);
    }

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden min-h-0">
                    <header className="mb-8 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-slate-900">Lessons</h1>
                        <p className="text-slate-500 mt-2">Manage lesson categories and their content.</p>
                    </header>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
                            <LessonManagement
                                categories={categories}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
