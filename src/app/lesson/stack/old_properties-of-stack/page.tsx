
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";

export default function PropertiesOfAStackPage() {
    const slug = "stack";
    const title = "properties-of-stack";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <PropertiesOfAStack />
                <DynamicVsStatic />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/what-is-a-stack`, label: "What is a Stack" }}
                next={{ href: `/lesson/${slug}/stack-operations`, label: "Stack Operations" }}
            />
        </div>
    );
}

function PropertiesOfAStack() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Properties of a Stack</Heading>
            <p>
                The most defining property of a stack is <strong>Last-In, First-Out (LIFO)</strong>. This means the last element added to the stack is the first one to be removed. Access is strictly limited to the "top" of the stack; you cannot legally reach into the middle or the bottom of the structure without first removing everything sitting above your target.
            </p>
        </section>
    )
}

function DynamicVsStatic() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Dynamic vs. Static Capacity</Heading>
            <p>
                A stack's capacity property depends entirely on its underlying implementation. When implemented with an <strong>array</strong>, the stack often has a <strong>fixed capacity</strong> or "static" nature. If you try to add an item to a full array-based stack, you encounter a property known as <strong>Stack Overflow</strong>. Conversely, a <strong>linked list</strong> implementation gives the stack a <strong>dynamic capacity</strong>, allowing it to grow and shrink in memory as needed, only limited by the total available RAM of the system.
            </p>
        </section>
    )
}

