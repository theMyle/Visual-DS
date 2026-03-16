import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";

export default function LinkedListIntroduction() {
    const slug = "linkedlist";
    const title = "introduction";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                next={{ href: `/lesson/${slug}/what-is-an-array`, label: "What is an Array" }}
            />
        </div>
    );
}