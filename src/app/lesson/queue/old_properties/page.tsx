
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";

export default function PropertiesOfAQueuePage() {
    const slug = "queue";
    const title = "properties";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <PropertiesOfAQueue />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/what-is-a-queue`, label: "What is a Queue" }}
                next={{ href: `/lesson/${slug}/operations`, label: "Queue Operations" }}
            />
        </div>
    );
}

function PropertiesOfAQueue() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Properties of a Queue</Heading>

            <p>
                The most defining property of a queue is <strong>First-In, First-Out (FIFO)</strong>. This means the order of processing strictly follows the order of arrival. Unlike a stack, a queue has two points of interaction: the <strong>Front</strong> (where data leaves) and the <strong>Rear</strong> (where data enters). You cannot legally reach into the middle of the structure; you must process every item that arrived before your target.
            </p>

            <p><strong>Ordered Processing</strong></p>

            <p>
                A queue's primary property is its ability to preserve the temporal order of data. This ensures fairness. If three tasks are sent to a printer, the queue ensures Task 1 finishes before Task 2 begins. This property is vital in asynchronous systems where data is produced at a different rate than it is consumed, acting as a buffer to prevent data loss or "overflowing" the receiver.
            </p>
        </section>
    )
}