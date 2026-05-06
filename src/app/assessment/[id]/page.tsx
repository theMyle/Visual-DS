"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Assessment from "../components/Assessment";
import AssessmentLoading from "../components/AssessmentLoading";
import { fetchAssessmentById, fetchAttemptStatus } from "../../lib/assessments/api";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function DynamicAssessmentPage() {
    const params = useParams();
    const id = params.id as string;
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { redirectToSignIn } = useClerk();

    const { data, isPending: isAssessmentPending, isError: isAssessmentError } = useQuery({
        queryKey: ["assessment", id],
        queryFn: () => fetchAssessmentById(id, getToken),
        enabled: !!id && isLoaded,
    });

    const { data: attemptStatus, isPending: isAttemptPending } = useQuery({
        queryKey: ["attempt-status", id],
        queryFn: () => fetchAttemptStatus(id, getToken),
        enabled: !!id && isLoaded,
    });

    const isPending = isAssessmentPending || isAttemptPending;

    if (!isLoaded || isPending) {
        return <AssessmentLoading label="Preparing assessment" />;
    }

    if (isAssessmentError || !data) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                    <p className="font-bold text-sm">Failed to load assessment.</p>
                    <p className="text-xs mt-1 opacity-80">The assessment might have been deleted or the ID is invalid.</p>
                </div>
            </div>
        );
    }

    // If the attempt status shows limit_reached, gate access
    if (attemptStatus?.limit_reached) {
        const isLoggedOut = !isSignedIn;

        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    {isLoggedOut ? (
                        <>
                            <h2 className="text-lg font-bold text-slate-800">Login Required</h2>
                            <p className="text-sm text-slate-500">
                                This assessment has a limited number of attempts. Please log in to track your progress.
                            </p>
                            <button
                                onClick={() => redirectToSignIn()}
                                className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition-colors text-sm"
                            >
                                Log In to Continue
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold text-slate-800">Attempt Limit Reached</h2>
                            <p className="text-sm text-slate-500">
                                You've used all{" "}
                                <span className="font-semibold text-slate-700">
                                    {attemptStatus.max_attempts} attempt{attemptStatus.max_attempts !== 1 ? "s" : ""}
                                </span>{" "}
                                for this assessment.
                            </p>
                            <p className="text-xs text-slate-400">Contact your instructor to reset your attempts.</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Assessment
            assessmentData={data}
            attemptsUsed={attemptStatus?.attempts_used ?? 0}
            maxAttempts={attemptStatus?.max_attempts ?? null}
        />
    );
}
