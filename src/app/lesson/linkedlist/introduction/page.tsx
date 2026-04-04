import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import ListSection from "../../components/ListSection";

export default function LinkedListIntroduction() {
    const slug = "linkedlist";
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
                next={{ href: `/lesson/${slug}/what-is-a-linkedlist`, label: "What is a Linked List" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>

            <Heading>Introduction</Heading>

            <p>
                Welcome to the Linked List module. You will learn what Linked Lists are, their key properties, and the efficiency of common operations.
            </p>

            <ListSection title="In this module we will learn about:">
                <li>What a Linked List is</li>
                <li>Properties of Linked List</li>
                <li>Efficiency of common Linked List Operations</li>
            </ListSection>

        </section>
    )
}