

import BottomNav from "../../components/BottomNav";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";

export default function WhatIsAnArray() {
    const slug = "array";
    const title = "types-of-array";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/what-is-an-array`, label: "What is an Array" }}
                next={{ href: `/lesson/${slug}/array-operations`, label: "Array Operations" }}
            />
        </div>
    );
}

