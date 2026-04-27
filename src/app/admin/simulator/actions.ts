'use server';

import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import { revalidatePath } from "next/cache";

export async function updateSimulatorCategory(
    id: string, 
    name: string, 
    slug: string, 
    description: string, 
    initialCode: string, 
    isActive: boolean
) {
    const { getToken } = await auth();

    await fetchAdminApi(`simulators/${id}`, getToken, {
        method: "PUT",
        body: JSON.stringify({
            name,
            slug,
            description,
            initial_code: initialCode,
            is_active: isActive
        })
    });

    revalidatePath("/admin/simulator");
}

export async function createChallenge(data: any) {
    const { getToken } = await auth();

    await fetchAdminApi(`challenges`, getToken, {
        method: "POST",
        body: JSON.stringify(data)
    });

    revalidatePath("/admin/simulator");
}

export async function updateChallenge(id: string, data: any) {
    const { getToken } = await auth();

    await fetchAdminApi(`challenges/${id}`, getToken, {
        method: "PUT",
        body: JSON.stringify(data)
    });

    revalidatePath("/admin/simulator");
}

export async function deleteChallenge(id: string) {
    const { getToken } = await auth();

    await fetchAdminApi(`challenges/${id}`, getToken, {
        method: "DELETE"
    });

    revalidatePath("/admin/simulator");
}

export async function fetchChallenge(id: string) {
    const { getToken } = await auth();
    return await fetchAdminApi<any>(`challenges/${id}`, getToken);
}
