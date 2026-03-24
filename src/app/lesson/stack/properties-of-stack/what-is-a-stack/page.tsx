import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../../components/MarkAsDone";
import BottomNav from "../../../components/BottomNav";
import { SECTION_CLASS } from "../../../components/constants";
import Heading from "../../../components/Heading";
import VideoEmbed from "../../../components/VideoEmbed";
import VisualImage from "../../../components/VisualImage";

export default function WhatIsAStackPage() {
    const slug = "stack";
    const title = "what-is-a-stack";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <Body />
                <AdditionalResources />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/introduction`, label: "Introduction" }}
                next={{ href: `/lesson/${slug}/properties-of-stack`, label: "Properties of a Stack" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>What is a Stack</Heading>

            <p>
                A <strong>stack </strong> is a fundamental linear data structure that operates on the <strong>Last-In, First-Out (LIFO)</strong> principle, meaning the most recently added element is the first one to be removed. Think of it like a physical stack of plates in a cafeteria: you add new items to the top and retrieve them from the top, while the items at the bottom remain inaccessible until everything above them is cleared. In computing, this behavior is managed through two primary operations <strong>push </strong> (adding an item) and <strong>pop </strong>(removing an item) making it an essential tool for managing function calls, undo mechanisms in software, and expression parsing.
            </p>

            <VisualImage
                src="/lessons/stack/stack.png"
                alt="A generic stack image"
            />

            <p>
                Under the hood, a stack is usually implemented with either an <strong>array </strong> or a <strong>linked</strong> list because these structures provide the linear foundation needed to maintain <strong>LIFO</strong> order. An <strong>array-based implementation</strong> is often the default choice for its memory efficiency and speed; it stores elements in contiguous blocks and utilizes a simple integer pointer to track the "top," making access nearly instantaneous. While adding an element is generally <strong>amortized constant time O(1)</strong>, it may occasionally require a "resize" to a larger memory block if the stack becomes full. Conversely, removal is extremely fast because the system simply decrements the pointer, effectively ignoring the old data without needing to physically erase it or shrink the allocated memory.
            </p>

            <p>
                Alternatively, a <strong>linked list implementation</strong> is used when dynamic scaling and guaranteed performance are the priorities. This approach provides a <strong>strict O(1) constant</strong> time for every push and pop operation because it never needs to pause for a resize. Instead of one large block, each element is an independent "node" that points to the next, allowing the stack to grow or shrink seamlessly as long as memory is available. While this avoids the "hiccups" of an array, it does carry a small memory overhead since each node must store an extra pointer alongside the actual data. This makes linked lists ideal for environments where the maximum stack size is unpredictable or where memory is heavily fragmented.
            </p>
        </section>
    )
}

function AdditionalResources() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Additional Resources</Heading>
            <VideoEmbed
                embedUrl="https://www.youtube.com/embed/I5lq6sCuABE?si=CQz-R0uxd1LkTOYa"
            />
        </section>
    )
}