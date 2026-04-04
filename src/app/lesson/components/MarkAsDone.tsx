"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useClerk } from "@clerk/nextjs"; // Added useClerk
import { cn } from "@/app/lib/utils";
import { FetchWithAuth } from "@/app/lib/fetchWithAuth";

interface MarkAsDoneProps {
    categorySlug: string;
    href: string;
}

interface ProgressItem {
    lesson_category: string;
    lesson_id: string;
}

export default function MarkAsDone({ categorySlug, href }: MarkAsDoneProps) {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { redirectToSignIn } = useClerk(); // Clerk's helper for programmatic redirect
    const queryClient = useQueryClient();

    const { data: progress } = useQuery({
        queryKey: ["progress"],
        queryFn: async () => {
            const data = await FetchWithAuth<ProgressItem[]>("/api/progress", getToken);
            return data ?? [];
        },
        enabled: !!(isLoaded && isSignedIn),
    });

    const progressArray = Array.isArray(progress) ? progress : [];
    const isDone = progressArray.some(
        (p) => p.lesson_category === categorySlug && p.lesson_id === href
    );

    const toggleMutation = useMutation({
        mutationFn: async () => {
            const method = isDone ? "DELETE" : "POST";
            const encodedId = encodeURIComponent(href);
            return FetchWithAuth(`/api/progress/${categorySlug}/${encodedId}`, getToken, { method });
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["progress"] });
            const previousProgress = queryClient.getQueryData<ProgressItem[]>(["progress"]) ?? [];

            queryClient.setQueryData<ProgressItem[]>(["progress"], (old) => {
                const current = old ?? [];
                if (isDone) {
                    return current.filter(p => !(p.lesson_category === categorySlug && p.lesson_id === href));
                } else {
                    return [...current, { lesson_category: categorySlug, lesson_id: href }];
                }
            });

            return { previousProgress };
        },
        onError: (err, variables, context) => {
            if (context?.previousProgress) {
                queryClient.setQueryData(["progress"], context.previousProgress);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["progress"] });
        },
    });

    const handleToggle = () => {
        if (!isLoaded) return;

        // If not signed in, redirect them to sign-in page
        // Clerk will automatically bring them back here after login
        if (!isSignedIn) {
            redirectToSignIn({ redirectUrl: window.location.href });
            return;
        }

        if (toggleMutation.isPending) return;
        toggleMutation.mutate();
    };

    // We only hide the component while the auth state is physically loading
    if (!isLoaded) return null;

    return (
        <div className="flex justify-center w-full py-10">
            <button
                onClick={handleToggle}
                className={cn(
                    "flex items-center justify-center gap-3 transition-all duration-300",
                    "w-72 h-11 rounded-full text-sm font-semibold tracking-wide shadow-sm",
                    isDone
                        ? "bg-green-100 text-green-700 shadow-inner"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.97]"
                )}
            >
                <CheckIcon isDone={isDone} />
                <span className="min-w-[100px] text-center uppercase tracking-widest text-[11px]">
                    {isDone ? "Lesson Completed" : "Mark as done"}
                </span>
            </button>
        </div>
    );
}

function CheckIcon({ isDone }: { isDone: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full transition-all duration-500",
            isDone
                ? "bg-green-600 text-white rotate-0"
                : "bg-gray-300 text-transparent -rotate-180"
        )}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={cn(
                    "w-3 h-3 transition-transform duration-300",
                    isDone ? "scale-100" : "scale-0"
                )}
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    );
}