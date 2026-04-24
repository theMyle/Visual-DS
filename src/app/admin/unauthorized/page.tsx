export default function AdminUnauthorizedPage() {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Unauthorized</p>
                <h1 className="mt-1 text-2xl font-bold text-red-900">You do not have access</h1>
                <p className="mt-2 text-sm text-red-800">
                    Your account is signed in, but it does not have admin permissions for this dashboard.
                </p>
            </div>
        </div>
    );
}
