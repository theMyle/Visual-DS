import { auth, currentUser } from "@clerk/nextjs/server";
import { checkCertificateEligibility } from "../lib/certificate/eligibility";
import CertificatePageClient from "./CertificatePageClient";
import { redirect } from "next/navigation";

export default async function CertificatePage() {
    const { userId, getToken } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("/login");
    }

    const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Valued Learner";
    const status = await checkCertificateEligibility(getToken, fullName);

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <CertificatePageClient status={status} />
        </div>
    );
}
