import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../../../components/AdminSidebar";
import AssessmentAnalytics from "../components/AssessmentAnalytics";
import Link from "next/link";
import { updateQuestion, deleteQuestion } from "../actions";

interface AssessmentDetail {
    id: string;
    category: string;
    questions: any[];
}

export default async function AssessmentAnalyticsPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params;
    const { getToken } = await auth();
    
    let assessment: AssessmentDetail | null = null;
    let error: string | null = null;

    try {
        assessment = await fetchAdminApi<AssessmentDetail>(`assessments/${id}`, getToken);
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to fetch assessment data";
    }

    const onUpdate = updateQuestion.bind(null, id);
    const onDelete = deleteQuestion.bind(null, id);

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden">
                    <header className="mb-8 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Link 
                                href="/admin/assessment"
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Performance analysis for <span className="text-indigo-600 font-medium">{assessment?.category || id}</span> assessment.</p>
                    </header>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : assessment ? (
                        <div className="flex-1 overflow-hidden">
                            <AssessmentAnalytics 
                                assessmentId={id}
                                category={assessment.category}
                                questions={assessment.questions}
                                onUpdateQuestion={onUpdate}
                                onDeleteQuestion={onDelete}
                            />
                        </div>
                    ) : (
                        <div className="bg-slate-100 p-8 rounded-2xl text-center">
                            <p className="text-slate-500">Loading assessment data...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
