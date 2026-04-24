import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "./components/AdminSidebar";
import UserManagement from "./components/UserManagement";

export default async function AdminPage() {
    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-50">
            {/* Left Sidebar */}
            <AdminSidebar />

            {/* Right Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto overflow-hidden">
                    <header className="mb-8 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-2">Manage your users, assessments, and view platform analytics.</p>
                    </header>

                    <div className="flex-1 overflow-hidden">
                        <UserManagement />
                    </div>
                </div>
            </main>
        </div>
    );
}






