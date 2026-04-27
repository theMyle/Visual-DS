import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../components/AdminSidebar";
import SimulatorManagement, { SimulatorCategoryDTO } from "./components/SimulatorManagement";
import { updateSimulatorCategory, createChallenge } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSimulatorPage() {
    const { getToken } = await auth();

    let simulators: SimulatorCategoryDTO[] = [];
    let error: string | null = null;

    try {
        simulators = await fetchAdminApi<SimulatorCategoryDTO[]>("simulators", getToken);
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to fetch simulator categories";
        console.error("Admin Simulator Fetch Error:", e);
    }

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            {/* Left Sidebar */}
            <AdminSidebar />

            {/* Right Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden min-h-0">
                    <header className="mb-8 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-slate-900">Simulators</h1>
                        <p className="text-slate-500 mt-2">View simulator categories and their challenges.</p>
                    </header>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
                            <SimulatorManagement
                                simulators={simulators}
                                onUpdate={updateSimulatorCategory}
                                onCreateChallenge={createChallenge}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
