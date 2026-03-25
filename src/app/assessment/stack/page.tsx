import Assessment from "../components/Assessment";
import { stackAssessment } from "./questions";

export default function LinkedListAssessmentPage() {
    return <Assessment assessmentData={stackAssessment} />;
}
