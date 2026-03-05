
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import BottomNav from "../../components/BottomNav";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";
import ListSection from "../../components/ListSection";
import VideoEmbed from "../../components/VideoEmbed";
import VisualImage from "../../components/VisualImage";

export default function WhatIsAnArray() {
    const slug = "array";
    const title = "what-is-an-array";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <Array />
                <KeyCharacteristicsOfAnArray />
                <Resources />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                next={{ href: `/lesson/${slug}/types-of-array`, label: "Types of Array" }}
            />
        </div>
    );
}

function Array() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>What is an Array?</Heading>

            <p>
                Traditionally, an array is a container that holds a fixed number of values of a single type stored in contiguous (next to each other) memory locations. It is one of the fundamental data structures that other structures are built upon.
            </p>

            <p>
                Arrays store data in elements which are accessed using indices. An index acts as an offset; it tells the computer exactly how far to jump from the starting memory address to find the desired value. By convention, indexing starts at 0, meaning the first element has an offset of zero from the start of the array.
            </p>

            <VisualImage
                src="/lessons/array/array-diagram.png"
                alt="Array diagram"
            />

            <p>
                When an array is initialized, the system allocates a single, unbroken block of memory. This physical layout is the defining characteristic of the structure. Because the elements are adjacent, the computer calculates the physical address of any element using a base-plus-offset formula. If you know the starting address and the size of the data type, you can jump to any specific element immediately without traversing the ones before it.
            </p>

            <VisualImage
                src="/lessons/array/array-index-calculation.png"
                alt="Array index calculation diagram"
            />

            <p>
                This leads to a key superpower of the array: extremely fast random access. Since the position can be calculated mathematically, the computer achieves constant time O(1) access regardless of whether it is retrieving the first or the last item in the list.
            </p>

        </section >
    )
}

function KeyCharacteristicsOfAnArray() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Key Characteristics of an Array</Heading>

            <ListSection>
                <li>
                    <strong>Contiguous Memory Allocation:</strong> Elements are stored in a single, unbroken block of memory where each item is physically adjacent to the next.
                </li>

                <li>
                    <strong>Constant Time Random Access:</strong> Any element can be accessed in O(1) time because its position is calculated mathematically rather than by searching.
                </li>

                <li>
                    <strong>Fixed Size:</strong> The total capacity is defined at the time of initialization and cannot be changed without reallocating a new block of memory.
                </li>
            </ListSection>
        </section>
    )
}

function Resources() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Additional Resources</Heading>
            <VideoEmbed
                embedUrl="https://www.youtube.com/embed/QJNwK2uJyGs?si=fJNEhddFoCLpVQxl"
            />
        </section>
    )
}