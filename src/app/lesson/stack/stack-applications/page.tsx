
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import VisualImage from "../../components/VisualImage";
import VideoEmbed from "../../components/VideoEmbed";

export default function StackOperationsPage() {
    const slug = "stack";
    const title = "stack-applications";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                <Body />
                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/stack-operations`, label: "Stack Operations" }}
                next={{ href: `/lesson/`, label: "Lesson Page" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>

            <Heading>Stack Applications</Heading>

            <p>
                Since a stack maintains <strong>LIFO (Last-In, First-Out)</strong> order, its primary use case is in any scenario where you need to <strong>reverse a sequence of events</strong> or backtrack to a previous state. In software, this is most famously seen in the <strong>Undo/Redo</strong> mechanism; every action you take is pushed onto a stack, and when you hit "undo," the application simply pops the most recent action off the top to revert the document. Similarly, web browsers use a stack to manage your <strong>Navigation History</strong>, pushing each new URL onto the stack so that clicking the "back" button always returns you to the very last page you visited.
            </p>

            <VisualImage
                src="/lessons/stack/stack-undo.png"
                alt=""
                showAlt={false}
            />

            <p>
                Beyond simple user interfaces, stacks are critical for <strong>Expression Evaluation and Parsing</strong>. Compilers and calculators use stacks to handle nested parentheses and prioritize mathematical operators (like multiplication over addition) by holding values and operators in a stack until they are ready to be processed in the correct order. This is also how <strong>Function Call Management</strong> works in almost every programming language; when a function is called, its local variables and return address are pushed onto the "Call Stack," and when the function finishes, that information is popped off so the computer knows exactly where to resume execution in the previous function.
            </p>

            <VideoEmbed
                embedUrl="https://www.youtube.com/embed/CRTR5ljBjPM?si=BAgKhVLwRSzezrDx"
            />
        </section>
    )
}