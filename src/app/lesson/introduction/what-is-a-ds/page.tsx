import { section } from "framer-motion/client";
import BottomNav from "../../components/BottomNav";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import ListSection from "../../components/ListSection";
import VideoEmbed from "../../components/VideoEmbed";

export default function WhatIsDSPage() {
    const slug = "introduction";
    const title = "what-is-a-ds";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                <WhatIsADataStructure />
                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/what-is-an-algorithm`, label: "What is an Algorithm" }}
            />
        </div>
    );
}

function WhatIsADataStructure() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>What is a Data Structure</Heading>

            <p>
                At their core, data structures are specialized formats for organizing, processing, retrieving, and storing data. While an algorithm is the "recipe" or set of instructions, the data structure is the "container" that makes those instructions efficient or possible.
            </p>

            <ListSection title="Some examples:">
                <li>Stacks: Last in, first out.</li>
                <li>Queues: First in, first out.</li>
                <li>Linked Lists: A chain of nodes, efficient for inserts and deletes.</li>
                <li>Binary Trees: A tree where each node has up to two children.</li>
            </ListSection>

            <p>
                A data structure is a data organization, management, and storage format that enables efficient access and modification. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.
            </p>

            <ListSection title="In other words, a data structure:">
                <li>Stores data</li>
                <li>Organizes data so that it can easily be accessed and modified</li>
                <li>Contains algorithmic functions to expose the ability to read and modify the data</li>
            </ListSection>

            <VideoEmbed embedUrl="https://www.youtube.com/embed/VAt2mR7gY0k?si=-mkkEEbpWq4Ok_p9" />
        </section>
    )
}