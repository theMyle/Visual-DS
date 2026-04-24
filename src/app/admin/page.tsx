import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasAdminAccess } from "@/app/lib/auth/admin";
import { fetchAdminAssessments } from "@/app/lib/admin/api";

export default async function AdminPage() {
    const { userId, orgRole, sessionClaims, getToken } = await auth();

    if (!userId || !hasAdminAccess({ orgRole, sessionClaims })) {
        redirect("/");
    }

    let assessmentsPayload: unknown = null;
    let assessmentsError: string | null = null;

    try {
        assessmentsPayload = await fetchAdminAssessments(getToken);
    } catch (error) {
        assessmentsError = error instanceof Error ? error.message : String(error);
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Admin-only area is enabled. You can now add metrics cards, moderation tools, and management actions here.
                </p>

                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        /api/admin/assessments response
                    </p>

                    {assessmentsError ? (
                        <p className="mt-2 text-sm text-red-600">{assessmentsError}</p>
                    ) : (
                        <pre className="mt-2 overflow-x-auto text-xs text-slate-800">
                            {JSON.stringify(assessmentsPayload, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}
