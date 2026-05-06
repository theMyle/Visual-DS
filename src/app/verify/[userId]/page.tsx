import VerifyPageClient from "./VerifyPageClient";

export default async function VerifyPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    return <VerifyPageClient userId={userId} />;
}
