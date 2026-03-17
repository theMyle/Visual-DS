
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import VisualImage from "../../components/VisualImage";
import ListSection from "../../components/ListSection";
import VideoEmbed from "../../components/VideoEmbed";

export default function WhatIsALinkedListPage() {
    const slug = "linkedlist";
    const title = "what-is-a-linkedlist";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <WhatIsALinkedList />
                <KeyCharacteristics />
                <AdditionalResources />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/introduction`, label: "Introduction" }}
                next={{ href: `/lesson/${slug}/linkedlist-properties`, label: "Linked List Properties" }}
            />
        </div>
    );
}

function WhatIsALinkedList() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>What Is A Linked List</Heading>

            <p>
                A Linked List is a fundamental linear data structure that organizes data in a sequence, similar to an array. However, unlike arrays, which allocate memory contiguously, linked lists store elements <strong>non-contiguously</strong>. This non-contiguous storage method is what makes linked lists significantly more efficient for operations involving <strong>frequent insertions and deletions</strong>. The linked list is a vital building block for creating many other, more complex data structures.
            </p>

            <VisualImage
                src="/lessons/linkedlist/linkedlist.png"
                alt="A generic linked list image"
            />

            <p>
                A <strong>linked list</strong> is a dynamic data structure whose name describes its underlying organization. Unlike an array, which stores elements sequentially in contiguous memory, a linked list consists of separate blocks of memory, called <strong>nodes</strong>, that point or link to one another.
            </p>

            <ListSection
                title="Nodes have two parts:"
            >
                <li><strong>Data</strong>: This holds the actual value (such as an integer, a string, or a complex object)</li>
                <li><strong>Next Pointer</strong>: This holds the memory address of the following node in the sequence.
                </li>
            </ListSection>

            <VisualImage
                src="/lessons/linkedlist/node.png"
                alt="Image of a Linked list node showing data, and next pointer."
            />

            <p>
                Because each node "knows" where the next one is, the list can be scattered across different locations in your computer's memory (the Heap) and doesn’t require its elements to be stored beside each other. Consequently, linked lists are dynamically sized by default.
            </p>

            <p>
                This structure offers a key advantage: operations such as <strong>insertion and deletion are more efficient</strong> because they only require updating a node's next pointer, rather than shifting individual elements. However, this flexibility comes at a cost: you lose access by index and <strong>can only access items sequentially</strong>, as accessing any specific node requires traversing every single node that precedes it.
            </p>
        </section>
    )
}

function KeyCharacteristics() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Key Characteristics of Linked Lists</Heading>

            <ListSection title="" ordered={true}>
                <li><strong>Node Based</strong>: Composed of nodes.</li>
                <li><strong>Non-Contigous</strong>: Nodes are scattered in memory but linked together.</li>
                <li><strong>Dynamic Size</strong>: Can easily shrink or grow.</li>
                <li><strong>Sequential Access</strong>: Starts from the first node, to the next one, and so on.</li>
            </ListSection>
        </section>
    )
}

function AdditionalResources() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Additional Resources</Heading>

            <VideoEmbed embedUrl="https://www.youtube.com/embed/odW9FU8jPRQ?si=wzMT5wReCR3CcGm1" />
        </section>
    )
}