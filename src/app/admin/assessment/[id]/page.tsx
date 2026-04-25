import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../../components/AdminSidebar";
import QuestionManagement, { QuestionDTO } from "./components/QuestionManagement";
import Link from "next/link";
import { revalidatePath } from "next/cache";

interface QuestionManagementProps {
    assessmentId: string;
    initialQuestions: QuestionDTO[];
    onAddQuestion: (question: Partial<QuestionDTO>) => Promise<void>;
    onUpdateQuestion: (id: string, question: Partial<QuestionDTO>) => Promise<void>;
    onDeleteQuestion: (id: string) => Promise<void>;
}

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
        
        await fetchAdminApi(`assessments/${assessmentId}/questions`, getToken, {
            method: "POST",
            body: JSON.stringify(question)
        });
        
        revalidatePath(`/admin/assessment/${assessmentId}`);
    }

    async function updateQuestion(questionId: string, question: Partial<QuestionDTO>) {
        "use server";
        const { id: assessmentId } = await params;
        const { getToken } = await auth();
        
        await fetchAdminApi(`questions/${questionId}`, getToken, {
            method: "PUT",
            body: JSON.stringify(question)
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

    async function updateCategoryName(newName: string) {
        "use server";
        const { id: assessmentId } = await params;
        const { getToken } = await auth();
        
        await fetchAdminApi(`assessments/${assessmentId}`, getToken, {
            method: "PUT",
            body: JSON.stringify({ category: newName })
        });
        
        revalidatePath(`/admin/assessment/${assessmentId}`);
        revalidatePath(`/admin/assessment`);
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
                                    onUpdateQuestion={updateQuestion}
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
