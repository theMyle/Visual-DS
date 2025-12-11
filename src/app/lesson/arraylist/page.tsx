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
import VideoEmbed from "../components/VideoEmbed"

export default function ArrayList() {
    return (
        <div>
            <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
                <Array />
                <Array_List />
                <CommonOperations />
                <Examples />
                <Resources />
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
                An <Highlight>array</Highlight> is one of the simplest and most widely used data structures. It stores a collection of elements in <Highlight>contiguous memory</Highlight>, where each element has a fixed position called its <Highlight>index</Highlight>. This lets you access any element instantly if you know its index, without checking every other item.
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
                Arrays can hold many kinds of data (numbers, words, even objects) but what matters most is that every element has a specific position.

                Think of an <Highlight>Advent calendar</Highlight>: each numbered door is like an array index. You open door 1, then 2, then 3, always by number. You can't ask, “Which door has the candy?” You have to open the door by its number to see what's inside.
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
                associate with arrays such as inserting, deleting, or resizing come from
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

            <Callout>
                <p>
                    Arrays may slow down when inserting or removing elements at the front or middle, since other elements need to shift.
                    <strong> However</strong>, for small collections (like a few dozen or even a few hundred items) this slowdown is <strong>negligible</strong>.
                </p>
            </Callout>

            <p>
                Modern computers handle such operations extremely fast, and you'll only notice performance issues when working with tens of thousands of elements or doing these operations very frequently.
            </p>

            <p>
                So for most everyday use cases, even those “slow” array operations are perfectly fine.
            </p>

        </section>
    )
}

function UseCase() { }
function Examples() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Use cases</Heading>
            <p>
                So remember, you use arrays whenever you need to store and organize multiple pieces of related information in a specific order.
            </p>

            <p>
                One simple example is the <Highlight>shopping cart in online stores</Highlight>. Every time you add an item, it's placed into a list, just like adding an element to an array. You can view, remove, or update items by their position in the list, and when you check out, the program goes through each item in order to calculate the total. Arrays make this process efficient and organized, ensuring every item is tracked and accessed easily.
            </p>

            <p>
                Another good example is an <Highlight>Excel spreadsheet</Highlight>. Each cell in a row or column can be thought of as an element in an array. You can quickly access, update, or calculate values based on their position, like summing a column of numbers or retrieving a specific row. Arrays make these operations fast and straightforward, helping users organize and manipulate data efficiently.
            </p>

            <p>
                These examples show that arrays are ideal whenever you need <Highlight>ordered storage</Highlight> and <Highlight>quick access by position</Highlight>, whether it's for shopping items, spreadsheet data, or any list of related information.
            </p>

        </section>
    )
}

function Resources() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Additional Resources</Heading>
            <VideoEmbed
                embedUrl="https://www.youtube.com/embed/QJNwK2uJyGs?si=fJNEhddFoCLpVQxl"
            />
        </section>
    )
}