
import BackButton from "@/app/components/BackButton";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import CodeBlock from "../../components/CodeBlock";
import ListSection from "../../components/ListSection";
import TableSection from "../../components/TableSection";

export default function StackOperationsPage() {
    const slug = "stack";
    const title = "stack-operations";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <StackOperations />
                <PushAndPop />
                <PeekAndIsEmpty />
                <Table />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/properties-of-stack`, label: "Properties of a Stack" }}
                next={{ href: `/lesson/${slug}/stack-applications`, label: "Stack Applications" }}
            />
        </div>
    );
}

function StackOperations() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Stack Operations</Heading>
            <p>
                A stack is defined by a very limited and specific set of operations. Because you only ever interact with the "top" of the structure, these operations are incredibly efficient, typically executing in <strong>constant time O(1)</strong>.
            </p>

            <ListSection>
                <li>Push and Pop</li>
                <li>Peek and isEmpty</li>
            </ListSection>
        </section>
    )
}

function PushAndPop() {
    const codeSample = `#include <stack>

// …initialize stack
std::stack<std::string> undoStack;

// push items into the stack
undoStack.push("Draw Circle");
undoStack.push("Fill Red");
undoStack.push("Resize 50%");

// pop/take the item from the top of stack
// returns "Resize 50%" and removes it from the stack
std::string lastAction = undoStack.pop(); 
`

    return (
        <section className={SECTION_CLASS}>
            <Heading>Push and Pop</Heading>

            <CodeBlock
                language="c++"
                code={codeSample}
            />
        </section>
    )
}

function PeekAndIsEmpty() {
    const codeSample = `#include <stack>

// …initialize stack
std::stack<std::string> bookStack;

bookStack.push("The Hobbit");
bookStack.push("Great Expectations");
bookStack.push("Harry Potter");


// prints the top of the stack
std::cout << "Peek result: " << bookStack.top() << std::endl;
// “Harry Potter”

// result of isEmpty (true or false)
std::cout << "IsEmpty result: " << bookStack.empty() << std::endl;
“false”
`

    return (
        <section className={SECTION_CLASS}>
            <Heading>Peek and IsEmpty</Heading>

            <p>
                To help manage the stack, two informational operations are used: Peek (or Top) and IsEmpty. <strong>Peek</strong> allows you to look at the value of the top element without actually removing it. Since it only involves a single "read" of the top position, it is a constant time O(1) operation. <strong>IsEmpty</strong> is a simple boolean check used to determine if the stack contains any data. It returns true if the stack is empty and false otherwise, which is a lightning-fast O(1) check. This is crucial for preventing <strong>"Stack Underflow"</strong> errors, which occur if you try to Pop from a stack that has nothing left in it.
            </p>

            <CodeBlock
                language="c++"
                code={codeSample}
            />
        </section>
    )
}

function Table() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Stack Operations Complexity Table</Heading>

            <TableSection
                headers={["Stack Operations", "Time Complexity"]}
                rows={[
                    ["Push", "O(1)"],
                    ["Pop", "O(1)"],
                    ["Peek", "O(1)"],
                    ["isEmpty", "O(1)"],
                ]}
            />
        </section>
    )
}