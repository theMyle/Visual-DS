
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import TableSection from "../../components/TableSection";
import CodeBlock from "../../components/CodeBlock";
import VisualImage from "../../components/VisualImage";

export default function QueueApplicationsPage() {
    const slug = "queue";
    const title = "applications";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <QueueApplications />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/operations`, label: "Queue Operations" }}
                next={{ href: `/lesson/`, label: "Lesson Page" }}
            />
        </div>
    );
}

function QueueApplications() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Queue Applications</Heading>

            <p>
                Since a queue maintains FIFO order, its primary use case is in any scenario where fairness and "<strong>first-come, first-served</strong>" logic are required to manage a high volume of requests.
            </p>

            <Heading>McDonald's Order Queue</Heading>

            <p>
                In a modern McDonald's, the <strong>order queue</strong> acts as the essential bridge between the customer and the kitchen. When a customer pays at a kiosk, the system performs an <strong>enqueue</strong> operation to send the order to the back of the kitchen's digital queue. The staff <strong>peeks</strong> at the front of the queue to see what's next, then <strong>dequeues</strong> it to begin preparation. Once the meal is finished and served at the counter, the system moves to the next order in the exact sequence it was received. This ensures the staff works in order and prevents newer requests from jumping ahead of those waiting longer.
            </p>

            <VisualImage
                src="/lessons/queue/application1.png"
                alt="McDonalds Simplified Order Queue System"
                showAlt={true}
            />

            <Heading>Online Match Making</Heading>

            <p>
                <strong>Online Game Matchmaking</strong> In competitive games like League of Legends, queues are the backbone of the player experience. When you click "Find Match," you are placed into a matchmaking queue where an algorithm runs checks based on your rank to find an eligible pool of players. As more players are found, they are <strong>enqueued</strong> into specific slots until the required capacity for a match is met. Once the queue is full and the ranks are balanced, the system "pops" the queue to start the game instance. This preserves the temporal order of the lobby, ensuring that players who have been waiting the longest are the first ones placed into a starting match.
            </p>

            <VisualImage
                src="/lessons/queue/application2.png"
                alt="Simplified Matchmaking System"
                showAlt={true}
            />


        </section>
    )
}