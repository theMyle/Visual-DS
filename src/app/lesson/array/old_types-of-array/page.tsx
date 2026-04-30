

import BottomNav from "../../components/BottomNav";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import VisualImage from "../../components/VisualImage";

export default function WhatIsAnArray() {
    const slug = "array";
    const title = "types-of-array";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <TypesOfArray />
                <StaticArray />
                <DynamicArray />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/what-is-an-array`, label: "What is an Array" }}
                next={{ href: `/lesson/${slug}/array-operations`, label: "Array Operations" }}
            />
        </div>
    );
}

function TypesOfArray() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Types of Array</Heading>

            <p>
                There are <strong>two</strong> types of arrays, it can either be <strong>Static</strong> or <strong>Dynamic</strong>:
            </p>

        </section>
    )
}

function StaticArray() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Static Array</Heading>

            <p>
                A static array is a <strong>fixed-size</strong> data structure where the number of elements is determined at the time of declaration. In memory, the system allocates a specific, contiguous block that <strong>cannot be resized</strong>, expanded, or shrunk during the program's execution.
            </p>

            <p>
                If you reach the capacity of a static array and need to add more data, you must manually allocate a new, larger array and copy every existing element into the new block of memory before deleting the old one.
            </p>

            <VisualImage
                src="/lessons/array/array-static-append.png"
                alt="Adding new item to static array"
            />

            <p>
                This type is common in low-level languages like C or C++ where memory management is explicit. Because the size is constant, static arrays are highly memory-efficient as there is no "extra" space allocated for potential growth.
            </p>
        </section>
    )
}

function DynamicArray() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Dynamic Array</Heading>

            <p>
                A dynamic array is an improved version that can <strong>grow </strong> or <strong>shrink </strong> its capacity as needed during runtime. In high-level or interpreted languages like Python (List), JavaScript (Array), or Java (ArrayList), C++ (Vectors), this is the default behavior.
            </p>

            <p>
                Under the hood, a dynamic array still uses a static array, but it <strong>automates the resizing process</strong>. To do this efficiently, it maintains a distinction between its <strong>size</strong> (the number of items currently inside) and its <strong>capacity</strong> (the total amount of space it has reserved). When the size reaches the capacity, the structure allocates a new, larger block of memory, copies the items over, and updates its reference. Because it allocates more room than it needs, it often contains a block of memory that is currently unused. This "slack space" is a deliberate trade-off that allows most additions to happen in constant time, as the array only has to perform the slow work of rebuilding itself once in a while.
            </p>

            <VisualImage
                src="/lessons/array/array-dynamic.png"
                alt="Dynamic array size vs capacity"
            />

            <p>
                This provides the flexibility of a list that "expands" while maintaining the fast, index-based access of a traditional array. Some implementations also include a "shrink" mechanic where memory is released if a significant number of elements are deleted, ensuring the program does not waste memory.
            </p>

        </section>
    )
}