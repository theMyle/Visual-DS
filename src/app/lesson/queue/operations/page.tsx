
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import TableSection from "../../components/TableSection";
import CodeBlock from "../../components/CodeBlock";

export default function OperationsOfAQueuePage() {
    const slug = "queue";
    const title = "operations";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <QueueOperations />
                <EnqueueAndDequeue />
                <FrontAndIsEmpty />
                <QueueTable />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/properties`, label: "Queue Properties" }}
                next={{ href: `/lesson/${slug}/applications`, label: "Queue Applications" }}
            />
        </div>
    );
}

function QueueOperations() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Properties of a Queue</Heading>

            <p>
                A queue is defined by a specific set of operations. Because the system always knows exactly where the head and tail are located, these operations are incredibly fast.
            </p>

        </section>
    )
}

function EnqueueAndDequeue() {
    const sampleCode = `#include <queue>
#include <string>

int main() {
    // initialize queue
    std::queue<std::string> printQueue;

    // enqueue items to the back
    printQueue.push("Project_Report.pdf");
    printQueue.push("Photo_Album.jpg");
    printQueue.push("Invoice.docx");

    // dequeue/remove the item from the front
    std::string nextJob = printQueue.front(); 
    printQueue.pop(); // removes "Project_Report.pdf"
}`

    return (
        <section className={SECTION_CLASS}>
            <Heading>Enqueue and Dequeue</Heading>

            <p>
                The two primary operations are <strong>Enqueue</strong> and <strong>Dequeue</strong>. When you Enqueue, you add a new element to the rear of the queue. This is an O(1) operation because you are simply placing an item at a known end-point. Conversely, Dequeue removes the element at the front. This is also an O(1) operation; the queue provides the front item and simply moves the head pointer to the next element in line, effectively "forgetting" the old data.
            </p>

            <CodeBlock
                code={sampleCode}
                language="c++"
            />

        </section>
    )
}

function FrontAndIsEmpty() {
    const sampleCode = `#include <queue>
#include <iostream>

int main() {
    // initialize queue
    std::queue<int> ticketNumbers;

    ticketNumbers.push(101);
    ticketNumbers.push(102);

    // prints the front of the queue
    std::cout << "Front item: " << ticketNumbers.front() << std::endl;
    // "101"

    // result of empty check
    std::cout << "Is queue empty: " << (ticketNumbers.empty() ? "Yes" : "No") << std::endl;
    // "No"
}`

    return (
        <section className={SECTION_CLASS}>
            <Heading>Front and IsEmpty</Heading>

            <p>
                Two informational operations help manage the structure: <strong>Front</strong> (or Peek) and <strong>IsEmpty</strong>. Front allows you to see the value of the next item in line without actually removing it. Since it only involves a single read of the head position, it is an O(1) operation. IsEmpty is a simple boolean check used to determine if the queue contains any data. This is crucial for preventing errors that occur if you try to dequeue from a structure that is already empty.
            </p>

            <CodeBlock
                code={sampleCode}
                language="c++"
            />

        </section>
    )
}

function QueueTable() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Queue Operations Complexity Table</Heading>

            <TableSection
                headers={["Queue Operation", "Time Complexity"]}
                rows={[
                    ["Enqueue", "O(1)"],
                    ["Dequeue", "O(1)"],
                    ["Front/Peek", "O(1)"],
                    ["IsEmpty", "O(1)"],
                ]}
            />

        </section>
    )
}