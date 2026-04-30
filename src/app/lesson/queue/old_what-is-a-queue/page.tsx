
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import VideoEmbed from "../../components/VideoEmbed";

export default function WhatIsAQueuePage() {
    const slug = "queue";
    const title = "what-is-a-queue";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <WhatIsAQueue />
                <QueueDataStructure />
                <AdditionalResources />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/introduction`, label: "Introduction" }}
                next={{ href: `/lesson/${slug}/properties`, label: "Properties of a Queue" }}
            />
        </div>
    );
}

function WhatIsAQueue() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>What is a Queue</Heading>

            <p>
                A queue is a fundamental linear data structure that operates on the <strong>First-In, First-Out (FIFO)</strong> principle, meaning the first element added to the structure is the first one to be removed. Think of it like a real-world waiting line at a coffee shop: the person who arrives first is served first, and new arrivals join the back of the line. In computing, this behavior is managed through two primary actions known as <strong>enqueue</strong> (adding to the back) and <strong>dequeue</strong> (removing from the front). This makes it an essential tool for managing shared resources, print jobs, and data packets in networking.
            </p>
        </section>
    )
}

function QueueDataStructure() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Queue Data Structure</Heading>
            <p>
                Under the hood, a queue is usually implemented with either a circular array or a linked list to maintain its linear <strong>FIFO</strong> order efficiently.
            </p>

            <p><strong>The Circular Buffer (Array-Based)</strong></p>

            <p>
                A standard array is actually a poor choice for a queue because removing an item from the front would leave an empty hole, forcing the system to shift every other element forward. This would make removal a slow O(n) operation. The <strong>Circular Queue</strong> solves this by connecting the last position of the array back to the first. It uses two pointers (<strong>Head</strong> and <strong>Tail</strong>) that move independently. When the Tail reaches the end of the memory block, it simply wraps back around to any empty slots at the beginning, ensuring that both adding and removing items remain constant time O(1) without wasting space.
            </p>

            <p><strong>Linked List</strong></p>

            <p>
                Alternatively, a linked list implementation is used when you need a dynamic capacity. In this setup, each element is an independent "node" containing the data and a pointer to the next item. By maintaining a reference to both the head and the tail nodes, the system can perform additions at the back and removals at the front in strict O(1) time. This approach is ideal for environments where the maximum size of the queue is unpredictable, as it only uses as much memory as there are items currently in the line.
            </p>
        </section>
    )
}

function AdditionalResources() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Additional Resources</Heading>

            <VideoEmbed
                embedUrl="https://www.youtube.com/embed/mDCi1lXd9hc?si=XYdVjzMh0KsRRAw2"
            />
        </section>
    )
}