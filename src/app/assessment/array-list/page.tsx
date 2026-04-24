"use client";

import { useQuery } from "@tanstack/react-query";
import Assessment from "../components/Assessment";
import AssessmentLoading from "../components/AssessmentLoading";
import { fetchAssessmentById } from "../../lib/assessments/api";

const CATEGORY = "array-list";
const ASSESSMENT_ID = "array-list-1";

export default function ArrayListAssessmentPage() {
    const { data, isPending, isError } = useQuery({
        queryKey: ["assessment", CATEGORY, ASSESSMENT_ID],
        queryFn: () => fetchAssessmentById(CATEGORY, ASSESSMENT_ID),
    });

    if (isPending) {
        return <AssessmentLoading label="Preparing array assessment" />;
    }

    if (isError || !data) {
        return <div className="p-4 text-sm text-red-600">Failed to load assessment.</div>;
    }

    return <Assessment assessmentData={data} />;
}
