import Assessment from "../components/Assessment";
import { queueBasicsAssessment } from "./questions";

export default function LinkedListAssessmentPage() {
    return <Assessment assessmentData={queueBasicsAssessment} />;
}
