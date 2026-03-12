
import Heading from "../../components/Heading";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import ListSection from "../../components/ListSection";
import BackButton from "@/app/components/BackButton";
import { SECTION_CLASS } from "../../components/constants";

export default function ArrayIntroduction() {
    const slug = "array";
    const title = "introduction";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                <Body />
                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                next={{ href: `/lesson/${slug}/what-is-an-array`, label: "What is an Array" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Introduction</Heading>

            <p>
                Welcome to the Array module. Before we dive into specific code examples, it's important to understand the high-level goals of this section.
            </p >

            <ListSection title="In this module we will learn about:">
                <li>The Array Data structure</li>
                <li>Static vs. Dynamic Arrays</li>
                <li>Efficiency of common Array Operations</li>
            </ListSection>

        </section >
    )
}