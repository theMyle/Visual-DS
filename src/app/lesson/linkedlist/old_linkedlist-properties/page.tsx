import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import VisualImage from "../../components/VisualImage";
import Heading from "../../components/Heading";
import ListSection from "../../components/ListSection";

export default function LinkedListPropertiesPage() {
    const slug = "linkedlist";
    const title = "linkedlist-properties";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <Body />
                <KeyProperties />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/what-is-a-linkedlist`, label: "What is a Linked List" }}
                next={{ href: `/lesson/${slug}/linkedlist-operations`, label: "Linked List Operations" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>

            <Heading>Properties of a Linked List</Heading>

            <p>
                In the previous lesson, we established that linked lists are collections of <strong>Nodes</strong>, where each node is connected to the next one. A standard node consists of a <strong>Data </strong> field, which holds the value, and a <strong>Next</strong> field (or pointer), which references the subsequent node in the sequence.
            </p>

            <VisualImage
                src="/lessons/linkedlist/node-2.png"
                alt=""
            />

        </section>
    )
}

function KeyProperties() {
    return (
        <section className={SECTION_CLASS}>

            <Heading>Key Properties</Heading>

            <p>
                A singly linked list typically maintains several key properties to manage its structure and facilitate operations.
            </p>

            <ListSection>
                <li><strong>Head</strong></li>
                <li><strong>Tail</strong></li>
                <li><strong>Length</strong></li>
            </ListSection>

            <p>The <strong>Head</strong> is a crucial reference that points to the first node in the linked list. It serves as the necessary entry point for starting any traversal or operation that needs to access the beginning of the list.</p>

            <p>The <strong>Tail</strong> is a reference that points directly to the last node in the list. Maintaining a tail reference enables quick access for operations like appending a new node to the end of the list without needing to traverse the entire list first.
            </p>

            <p>The <strong>Length </strong> property represents the current number of nodes in the list. While this property is sometimes optional (as the length can be determined by traversing all nodes from the head), keeping an explicit length counter allows for O(1) determination of the list's size.</p>

            <VisualImage
                src="/lessons/linkedlist/linkedlist-2.png"
                alt=""
            />

        </section>
    )
}