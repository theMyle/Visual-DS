"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchAdminApi } from "@/app/lib/admin/api";

type AttemptLimitConfigProps = {
    assessmentId: string;
    initialMaxAttempts: number | null;
};

export default function AttemptLimitConfig({ assessmentId, initialMaxAttempts }: AttemptLimitConfigProps) {
    const { getToken } = useAuth();
    const [maxAttempts, setMaxAttempts] = useState<number | "">(initialMaxAttempts ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage("");
        try {
            const token = await getToken();
            const val = maxAttempts === "" ? null : Number(maxAttempts);
            await fetchAdminApi(`assessments/${assessmentId}/max-attempts`, async () => token, {
                method: "PATCH",
                body: JSON.stringify({ max_attempts: val }),
            });
            setSaveMessage("Saved!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (error) {
            console.error("Failed to update max attempts:", error);
            setSaveMessage("Error saving");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = async () => {
        if (!confirm("Are you sure you want to clear all attempt histories for this assessment? This will allow everyone to retake it. This action cannot be undone.")) return;
        
        setIsClearing(true);
        setSaveMessage("");
        try {
            const token = await getToken();
            await fetchAdminApi(`assessments/${assessmentId}/attempts`, async () => token, {
                method: "DELETE",
            });
            setSaveMessage("Attempts cleared!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (error) {
            console.error("Failed to clear attempts:", error);
            setSaveMessage("Error clearing");
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
                <h3 className="text-base font-bold text-slate-800">Attempt Limits</h3>
                <p className="text-sm text-slate-500 mt-1">Set the maximum number of times a user can take this assessment. Leave empty for unlimited.</p>
                {saveMessage && (
                    <p className="text-xs font-bold text-emerald-600 mt-2 animate-pulse">
                        {saveMessage}
                    </p>
                )}
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        min="1"
                        placeholder="Unlimited"
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                <button
                    onClick={handleClear}
                    disabled={isClearing}
                    className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                    {isClearing ? "Clearing..." : "Clear All Attempts"}
                </button>
            </div>
            
        </div>
    );
}
