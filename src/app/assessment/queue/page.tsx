"use client";

import { useQuery } from "@tanstack/react-query";
import Assessment from "../components/Assessment";
import AssessmentLoading from "../components/AssessmentLoading";
import { fetchAssessment } from "../components/fetchAssessment";

const CATEGORY = "queue";
const ASSESSMENT_ID = "queue-1";

export default function QueueAssessmentPage() {
    const { data, isPending, isError } = useQuery({
        queryKey: ["assessment", CATEGORY, ASSESSMENT_ID],
        queryFn: () => fetchAssessment(CATEGORY, ASSESSMENT_ID),
    });

    if (isPending) {
        return <AssessmentLoading label="Preparing queue assessment" />;
    }

    if (isError || !data) {
        return <div className="p-4 text-sm text-red-600">Failed to load assessment.</div>;
    }

    return <Assessment assessmentData={data} />;
}
