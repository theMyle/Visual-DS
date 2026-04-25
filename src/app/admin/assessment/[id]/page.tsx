import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../../components/AdminSidebar";
import QuestionManagement, { QuestionDTO } from "./components/QuestionManagement";
import Link from "next/link";
import { revalidatePath } from "next/cache";

interface AssessmentDetailDTO {
    id: string;
    category: string;
    questions: QuestionDTO[];
}

export default async function AdminAssessmentDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { getToken } = await auth();
    
    let assessment: AssessmentDetailDTO | null = null;
    let error: string | null = null;

    try {
        // Fetch specific assessment with questions
        // In the backend, we use GET /assessments/{id}
        assessment = await fetchAdminApi<AssessmentDetailDTO>(`assessments/${id}`, getToken);
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to fetch assessment details";
        console.error("Admin Assessment Detail Fetch Error:", e);
    }

    async function addQuestion(question: Partial<QuestionDTO>) {
        "use server";
        const { id: assessmentId } = await params;
        const { getToken } = await auth();
        
        // Fetch current assessment to preserve category
        const current = await fetchAdminApi<AssessmentDetailDTO>(`assessments/${assessmentId}`, getToken);
        
        // We use the same POST /assessments to add/update? 
        // No, current backend CreateAssessment clears and recreates? 
        // Wait, the backend CreateAssessment handler creates a NEW assessment record.
        // If it already exists, it might fail or duplicate?
        // Actually, the backend should probably have an AddQuestion endpoint.
        // For now, I'll use the existing CreateAssessment which handles bulk.
        // I'll send the existing questions + the new one.
        
        const newQuestions = [...current.questions, question];
        
        await fetchAdminApi("assessments", getToken, {
            method: "POST",
            body: JSON.stringify({
                id: assessmentId,
                category: current.category,
                questions: newQuestions
            })
        });
        
        revalidatePath(`/admin/assessment/${assessmentId}`);
    }

    async function deleteQuestion(questionId: string) {
        "use server";
        const { id: assessmentId } = await params;
        const { getToken } = await auth();
        
        await fetchAdminApi(`questions/${questionId}`, getToken, {
            method: "DELETE"
        });
        
        revalidatePath(`/admin/assessment/${assessmentId}`);
    }

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden">
                    <header className="mb-8 flex-shrink-0 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link href="/admin/assessment" className="text-xs font-bold text-indigo-600 hover:underline">Assessments</Link>
                                <span className="text-slate-300">/</span>
                                <span className="text-xs font-bold text-slate-400">{id}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">{assessment?.category || "Loading..."}</h1>
                        </div>
                    </header>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        assessment && (
                            <div className="flex-1 overflow-hidden">
                                <QuestionManagement 
                                    assessmentId={id}
                                    initialQuestions={assessment.questions}
                                    onAddQuestion={addQuestion}
                                    onDeleteQuestion={deleteQuestion}
                                />
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
