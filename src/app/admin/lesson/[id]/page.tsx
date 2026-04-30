import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import LessonEditor from "../components/LessonEditor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface LessonEditPageProps {
    params: Promise<{ id: string }>;
}

interface LessonResponse {
    lesson_id: string;
    category_id: string;
    slug: string;
    title: string;
    content: string;
    order_index: number;
}

interface CategoryResponse {
    category_id: string;
    title: string;
}

export default async function AdminLessonEditPage({ params }: LessonEditPageProps) {
    const { id } = await params;
    const { getToken } = await auth();

    let lessonData: LessonResponse;
    let categoryData: CategoryResponse | undefined;

    try {
        // Fetch lesson
        lessonData = await fetchAdminApi<LessonResponse>(`sub-lessons/${id}`, getToken);

        // Fetch category to get its title
        const categories = await fetchAdminApi<CategoryResponse[]>(`lessons`, getToken);
        categoryData = categories.find(c => c.category_id === lessonData.category_id);

    } catch (e) {
        console.error("Failed to fetch lesson for editing:", e);
        return notFound();
    }

    if (!lessonData) {
        return notFound();
    }

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden">
            <LessonEditor
                lesson={lessonData}
                categoryTitle={categoryData?.title || "Unknown Category"}
            />
        </div>
    );
}
