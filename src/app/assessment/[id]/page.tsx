"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Assessment from "../components/Assessment";
import AssessmentLoading from "../components/AssessmentLoading";
import { fetchAssessmentById } from "../../lib/assessments/api";

export default function DynamicAssessmentPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isPending, isError } = useQuery({
        queryKey: ["assessment", id],
        queryFn: () => fetchAssessmentById(id),
        enabled: !!id,
    });

    if (isPending) {
        return <AssessmentLoading label="Preparing assessment" />;
    }

    if (isError || !data) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                    <p className="font-bold text-sm">Failed to load assessment.</p>
                    <p className="text-xs mt-1 opacity-80">The assessment might have been deleted or the ID is invalid.</p>
                </div>
            </div>
        );
    }

    return <Assessment assessmentData={data} />;
}
