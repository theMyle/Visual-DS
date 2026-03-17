import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import ListSection from "../../components/ListSection";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import TextLink from "../../components/TextLink";
import TableSection from "../../components/TableSection";

export default function LinkedListOperationsPage() {
    const slug = "linkedlist";
    const title = "linkedlist-operations";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <LinkedListOperations />
                <Access />
                <Insertion />
                <Deletion />
                <Traversal />
                <Table />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/linkedlist-properties`, label: "Linked List Properties" }}
                next={{ href: `/lesson/`, label: "Lesson Page" }}
            />
        </div>
    );
}

function LinkedListOperations() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Linked List Operations</Heading>

            <p>
                Let’s talk about what you can do with a linked list. We are focusing on operations regarding a singly linked list for simplicity. There are lots of different types of linked lists out there, like <TextLink href="https://www.geeksforgeeks.org/dsa/doubly-linked-list/">doubly linked list</TextLink> and <TextLink href="https://www.geeksforgeeks.org/dsa/circular-linked-list/">circular linked list</TextLink>, but the core concepts are very similar.
            </p>

            <ListSection title="Common Linked List Operations:">
                <li><strong>Access</strong></li>
                <li><strong>Insertion</strong></li>
                <li><strong>Deletion</strong></li>
                <li><strong>Traversal</strong></li>
            </ListSection>

        </section>
    )
}


function Access() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Access</Heading>

            <ListSection>
                <li>First and Last Items: <strong>O(1)</strong></li>
                <li>Anywhere Else: <strong>O(n)</strong></li>
            </ListSection>

            <p>
                Unlike arrays, linked lists do <strong>not</strong> support random access. Because nodes are <strong>not</strong> stored in a continuous block of memory, the computer cannot calculate an address to "jump" to a specific spot. Accessing the Head or Tail is near-instant O(1) because the list maintains direct pointers to these specific nodes.
            </p>

            <p>
                Accessing any other element however whether it is in the middle or just one step away from the end requires traversal. You must start at the Head and follow the "Next" pointers node-by-node, resulting in a linear search time of O(n).
            </p>
        </section>
    )
}

function Insertion() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Insertion</Heading>

            <ListSection>
                <li>Fist, Middle, and Last: <strong>O(1)</strong></li>
            </ListSection>

            <p>
                Linked lists offer O(1) insertion because the operation only requires updating the pointers of the immediate neighbors. Unlike arrays, which must shift elements to create space, a linked list simply hooks a new node into the chain.
            </p>

            <p>
                The operation is constant time at the head and tail where you have direct access. However, if you don't have a reference to a middle node, it becomes O(n) because you must first traverse the list to find the insertion point.
            </p>
        </section>
    )
}

function Deletion() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Deletion</Heading>

            <ListSection>
                <li>Fist, Middle, and Last: <strong>O(1)</strong></li>
            </ListSection>

            <p>
                Deletion is a constant O(1) operation because you simply change a pointer to "skip" the node you want to remove. This is instantaneous at the head where the pointer is already available.
            </p>

            <p>
                The operation itself is constant time, but if you don't have access to the middle node, it becomes O(n) due to the search traversal. Deleting the last item in a singly linked list is also O(n) because you must traverse the list to find the node right before the tail to update its pointer.
            </p>
        </section>
    )
}

function Traversal() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Traversal</Heading>

            <ListSection>
                <li>Traversal: <strong>O(n)</strong></li>
            </ListSection>

            <p>
                Traversal is the act of visiting every node in the list exactly once. Since a linked list is a linear structure, the time it takes is directly proportional to the number of nodes (n). This is the foundation for many other operations, such as searching for a specific value or printing the entire collection.
            </p>
        </section>
    )
}

function Table() {
    return (
        <section className={SECTION_CLASS}>
            <TableSection
                headers={["Linked List Operation", "Time Complexity"]}
                rows={[
                    ["Access: First Item", "O(1)"],
                    ["Access: Last Item", "O(1)"],
                    ["Access: Middle Items", "O(n)"],
                    ["Insertion", "O(1)"],
                    ["Deletion", "O(1)"],
                ]}
            />

            <p>
                As we've seen, linked lists are most efficient when dealing with the first and last items of a collection. This is where the linked list truly beats an array: it allows for frequent insertion and deletion in O(1) time, without the expensive "shifting" of elements that arrays require. While you sacrifice the ability to jump instantly to any position/index, you gain a structure that is incredibly flexible for adding and removing data on the fly.
            </p>

            <p>
                The insertion and deletion operations themselves are constant time O(1), as they only require changing a few pointers. However, if you don't have direct access to the specific node you want to change, the process becomes linear O(n) because you must traverse the list from the beginning to reach that specific point.
            </p>
        </section>
    )
}