"use client"

import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0,
            },
        },
    }));

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            console.log("🧹 User logged out. Nuking TanStack Cache...");
            queryClient.clear();
        }
    }, [isSignedIn, isLoaded, queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}