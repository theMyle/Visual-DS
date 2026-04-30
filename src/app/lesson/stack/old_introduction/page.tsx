import Heading from "../../components/Heading";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import ListSection from "../../components/ListSection";
import BackButton from "@/app/components/BackButton";
import { SECTION_CLASS } from "../../components/constants";

export default function StackIntroduction() {
    const slug = "stack";
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
                next={{ href: `/lesson/${slug}/what-is-a-stack`, label: "What is a Stack" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Introduction</Heading>

            <p>
                Welcome to the Stack module. You will learn what a Stack data structure is, understand its key properties, and explore how stack operations and real-world applications work.
            </p>

            <ListSection title="In this module we will learn about:">
                <li>What is Stack Data Structure</li>
                <li>Stack Properties</li>
                <li>Stack Operations</li>
                <li>Stack Applications</li>
            </ListSection>

        </section>
    )
}
