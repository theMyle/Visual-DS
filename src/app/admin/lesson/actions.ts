'use server';

import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import { revalidatePath } from "next/cache";

export async function createLessonCategory(data: {
    slug: string;
    title: string;
    description: string;
    order_index: number;
}) {
    const { getToken } = await auth();

    await fetchAdminApi(`lessons`, getToken, {
        method: "POST",
        body: JSON.stringify(data)
    });

    revalidatePath("/admin/lesson");
}

export async function updateLessonCategory(id: string, data: {
    slug: string;
    title: string;
    description: string;
    order_index: number;
}) {
    const { getToken } = await auth();

    await fetchAdminApi(`lessons/${id}`, getToken, {
        method: "PUT",
        body: JSON.stringify(data)
    });

    revalidatePath("/admin/lesson");
}

export async function deleteLessonCategory(id: string) {
    const { getToken } = await auth();

    await fetchAdminApi(`lessons/${id}`, getToken, {
        method: "DELETE"
    });

    revalidatePath("/admin/lesson");
}

export async function createLesson(data: {
    category_id: string;
    slug: string;
    title: string;
    content: string;
    order_index: number;
}) {
    const { getToken } = await auth();

    await fetchAdminApi(`sub-lessons`, getToken, {
        method: "POST",
        body: JSON.stringify(data)
    });

    revalidatePath("/admin/lesson");
}

export async function updateLesson(id: string, data: {
    title: string;
    content: string;
    order_index: number;
}) {
    const { getToken } = await auth();

    await fetchAdminApi(`sub-lessons/${id}`, getToken, {
        method: "PUT",
        body: JSON.stringify(data)
    });

    revalidatePath("/admin/lesson");
}

export async function deleteLesson(id: string) {
    const { getToken } = await auth();

    await fetchAdminApi(`sub-lessons/${id}`, getToken, {
        method: "DELETE"
    });

    revalidatePath("/admin/lesson");
}

export async function fetchLessonsByCategory(slug: string) {
    const { getToken } = await auth();
    // Use the public API to fetch lessons for a category
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${slug}`, {
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error("Failed to fetch lessons");
    }
    return await response.json();
}
