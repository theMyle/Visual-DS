import Image from "next/image"
import { SECTION_CLASS } from "../components/constants"
import Heading from "../components/Heading"
import Highlight from "../components/Highlight"
import ListSection from "../components/ListSection"
import TableSection from "../components/TableSection"
import Callout from "../components/Callout"
import Advantages from "../components/Advantages"
import Drawbacks from "../components/Drawbacks"
import BottomNav from "../components/BottomNav"

export default function ArrayList() {
    return (
        <div>
            <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
                <Array />
                <Array_List />
                <CommonOperations />
            </main>
            <BottomNav
                prev={{ href: "/lesson/big-o", label: "Big-O" }}
            />
        </div>
    )
}

function Array() {
    return (
        <section className={SECTION_CLASS}>

            <Heading>Array</Heading>
            <p>
                An <Highlight>array</Highlight> is one of the simplest and most widely used data structures. It stores a collection of elements in <Highlight>contiguous memory locations</Highlight>, and each element can be accessed directly by its <Highlight>index</Highlight>. This makes arrays very fast for lookups: if you know the index, you can jump straight to the element without scanning everything before it.
            </p>

            <p className="text-slate-600">
                Array indices are <Highlight>zero-based</Highlight>, meaning the first element starts at index 0. A common mistake, even among experienced programmers, is the <Highlight>off-by-one error</Highlight>, which happens when this is overlooked.
            </p>

            <div className="flex justify-center p-4">
                <Image
                    src={"/lessons/array-list/array-diagram.png"}
                    alt="Array in memory diagram"
                    width={600}
                    height={100}
                />
            </div>

            <p>
                Arrays can store many kinds of data, such as numbers, strings, or even objects, but the important part is that each element has a specific position. Think of an <Highlight>Advent calendar</Highlight> (a holiday countdown calendar with numbered doors you open one per day with hidden surprises inside): each drawer is like an array index. You open drawer 1, 2, 3, and so on by number, you can't ask the calendar, “Find the one with the lollipop.” You can only open a drawer by its number, and you won't know what's inside until you open it.
            </p>

            <div className="flex justify-center p-4">
                <Image
                    src={"/lessons/array-list/advent-calendar.png"}
                    alt="Array in memory diagram"
                    width={400}
                    height={100}
                />
            </div>

            <ListSection title="Key characteristics of an Array">
                <li>Stores a collection of elements in order.</li>
                <li>Access each element by its index.</li>
                <li>Direct (or random) access is possible, so the 10th element can be retrieved instantly without touching the first 9.</li>
            </ListSection>

            <Advantages title="Advantages of arrays">
                <li>Keeps related data organized in one variable.</li>
                <li>Very fast element access through indexing.</li>
                <li>Efficient storage for same-typed elements.</li>
            </Advantages>

            <Callout variant="warning" title="Limitation">
                Size is <Highlight>fixed</Highlight> once created. To grow, allocate a new array and copy the data.
            </Callout>

        </section>
    )
}

function Array_List() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Array List</Heading>

            <p>
                Many programming languages also provide <Highlight>dynamic lists</Highlight> (often called <em>ArrayList</em>, <em>vector</em>, <em>list</em>, or simply <em>array</em>). Unlike static arrays, they can <Highlight>grow or shrink</Highlight> as needed. You can think of them as an enhanced version of arrays with extra built-in operations.
            </p>

            <ListSection title="Examples:">
                <li>C++ → Vector</li>
                <li>Javascript → Array</li>
                <li>Python → List</li>
                <li>C# → ArrayList</li>
            </ListSection>

            <p>
                Dynamic lists give you flexibility: you can add, remove, and resize without worrying about the underlying memory. But under the hood, they are still built on top of arrays, with extra logic to handle resizing.
            </p>

            <ListSection title="Key characteristics of an ArrayList">
                <li>Store elements in order, accessible by index.</li>
                <li> <Highlight>Resizable</Highlight>: can grow or shrink automatically as elements are added or removed.</li>
                <li>Allow random access (fast lookups using index), just like arrays.</li>
            </ListSection>

            <Advantages title="Advantages">
                <li>Flexible size: no need to know the exact number of elements ahead of time.</li>
                <li>Built-in operations for adding, removing, inserting, or searching.</li>
                <li>Convenient for most everyday programming tasks.</li>
            </Advantages>

            <Drawbacks title="Limitations">
                <li>Resizing has a cost: when the underlying array is full, a new larger array is created and all elements are copied over.</li>
                <li>Inserting or removing elements in the middle is slower than at the end (requires shifting elements).</li>
                <li>Slightly more memory overhead compared to a static array.</li>
            </Drawbacks>

        </section>
    );
}

function CommonOperations() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Array operations</Heading>

            <p>
                From here on, we'll use the term <Highlight>array</Highlight> to also refer to
                <Highlight> dynamic arrays</Highlight> (ArrayLists, vectors, lists, etc.), since they
                provide the practical operations most programmers rely on.
            </p>

            <p>
                A plain static array only supports the basics: creating it with a fixed size,
                accessing elements by index, and updating values. The richer operations we usually
                associate with arrays—such as inserting, deleting, or resizing—come from
                <Highlight> dynamic arrays</Highlight>, which are built on top of static arrays.
            </p>

            <TableSection
                title="Operation costs"
                headers={["Operation", "Time Complexity", "Description"]}
                rows={[
                    ["Access by index", "O(1)", "Directly access element by index"],
                    ["Update by index", "O(1)", "Replace value at an index"],
                    ["Insert at end", "Amortized O(1)", "Resize and/or insert at back"],
                    ["Insert middle", "O(n)", "Requires shifting elements"],
                    ["Insert front", "O(n)", "All elements shift to the right"],
                    ["Remove end", "O(1)", "Reduce the internal size counter"],
                    ["Remove middle", "O(n)", "Requires shifting elements"],
                    ["Remove front", "O(n)", "Requires shifting elements"],
                    ["Search (unsorted)", "O(n)", "Must scan linearly"],
                    ["Search (sorted)", "O(log n)", "Binary search possible"],
                ]}
            />

            <Advantages title="We can see that arrays shine in four operations">
                <li>Random access (including updating content)</li>
                <li>Insertion at the end</li>
                <li>Deletion at the end</li>
                <li>Searching when the array is sorted</li>
            </Advantages>
        </section>
    )
}

function UseCase() { }
function Examples() { }
function Why() { }
function Resources() { }