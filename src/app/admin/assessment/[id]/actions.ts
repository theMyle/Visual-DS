"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import { revalidatePath } from "next/cache";
import { QuestionDTO } from "./components/QuestionManagement";

export async function addQuestion(assessmentId: string, question: Partial<QuestionDTO>) {
    const { getToken } = await auth();
    
    await fetchAdminApi(`assessments/${assessmentId}/questions`, getToken, {
        method: "POST",
        body: JSON.stringify(question)
    });
    
    revalidatePath(`/admin/assessment/${assessmentId}`);
    revalidatePath(`/admin/assessment/${assessmentId}/analytics`);
}

export async function updateQuestion(assessmentId: string, questionId: string, question: Partial<QuestionDTO>) {
    const { getToken } = await auth();
    
    await fetchAdminApi(`questions/${questionId}`, getToken, {
        method: "PUT",
        body: JSON.stringify(question)
    });
    
    revalidatePath(`/admin/assessment/${assessmentId}`);
    revalidatePath(`/admin/assessment/${assessmentId}/analytics`);
}

export async function deleteQuestion(assessmentId: string, questionId: string) {
    const { getToken } = await auth();
    
    await fetchAdminApi(`questions/${questionId}`, getToken, {
        method: "DELETE"
    });
    
    revalidatePath(`/admin/assessment/${assessmentId}`);
    revalidatePath(`/admin/assessment/${assessmentId}/analytics`);
}
