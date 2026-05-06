import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../../components/AdminSidebar";
import QuestionManagement, { QuestionDTO } from "./components/QuestionManagement";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { addQuestion, updateQuestion, deleteQuestion } from "./actions";
import AttemptLimitConfig from "./components/AttemptLimitConfig";

interface AssessmentDetailDTO {
    id: string;
    category: string;
    max_attempts: number | null;
    questions: QuestionDTO[];
}

/**
 * Next.js 15 fix: params is now a Promise. 
 * We must define it as Promise<{ id: string }> to satisfy the build compiler.
 */
export default async function AdminAssessmentDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Await the params before using them
    const { id } = await params;
    const { getToken } = await auth();

    let assessment: AssessmentDetailDTO | null = null;
    let error: string | null = null;

    try {
        assessment = await fetchAdminApi<AssessmentDetailDTO>(`assessments/${id}`, getToken);
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to fetch assessment details";
        console.error("Admin Assessment Detail Fetch Error:", e);
    }

    async function updateCategoryName(newName: string) {
        "use server";
        // Re-awaiting params inside the server action scope
        const { id: assessmentId } = await params;
        const { getToken: getActionToken } = await auth();

        await fetchAdminApi(`assessments/${assessmentId}`, getActionToken, {
            method: "PUT",
            body: JSON.stringify({ category: newName })
        });

        revalidatePath(`/admin/assessment/${assessmentId}`);
        revalidatePath(`/admin/assessment`);
    }

    // Wrap actions with assessmentId
    const onAdd = addQuestion.bind(null, id);
    const onUpdate = updateQuestion.bind(null, id);
    const onDelete = deleteQuestion.bind(null, id);

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            <AdminSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden">
                    <header className="mb-8 flex-shrink-0 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link href="/admin/assessment" className="text-xs font-bold text-indigo-600 hover:underline">
                                    Assessments
                                </Link>
                                <span className="text-slate-300">/</span>
                                <span className="text-xs font-bold text-slate-400">{id}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {assessment?.category || "Loading..."}
                            </h1>
                        </div>
                    </header>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        assessment && (
                            <div className="flex-1 overflow-hidden flex flex-col gap-6">
                                <AttemptLimitConfig 
                                    assessmentId={id} 
                                    initialMaxAttempts={assessment.max_attempts} 
                                />
                                <div className="flex-1 overflow-hidden min-h-0 bg-white rounded-xl border border-slate-200">
                                    <QuestionManagement
                                        assessmentId={id}
                                        initialQuestions={assessment.questions}
                                        onAddQuestion={onAdd}
                                        onUpdateQuestion={onUpdate}
                                        onDeleteQuestion={onDelete}
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}