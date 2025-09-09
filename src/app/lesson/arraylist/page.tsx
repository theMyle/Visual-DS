import { SECTION_CLASS } from "../components/constants"
import Heading from "../components/Heading"
import Highlight from "../components/Highlight"
import ListSection from "../components/ListSection"

export default function ArrayList() {
    return (
        <div>
            <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
                <Introduction />
                <Array />
                <Array_List />

                {/* 
                <Operations />
                <Drawbacks /> 
                */}
            </main>
        </div>
    )
}

function Introduction() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Introduction</Heading>
            <p>
                An <Highlight>ArrayList</Highlight> is one of the most common and versatile data structures in modern programming. It appears under different names in different languages:
            </p>

            <ListSection>
                <li>C++ → <strong>vector</strong></li>
                <li>JavaScript → <strong>array</strong></li>
                <li>Python → <strong>list</strong></li>
                <li>Java & C# → <strong>ArrayList</strong></li>
            </ListSection>

            <p>
                In fact, in many modern languages, the terms <Highlight>array</Highlight> and <Highlight>ArrayList</Highlight> are often used interchangeably because their built-in implementations behave like dynamic arrays by default.
            </p>

            <p>
                At its core, an ArrayList is a type of <Highlight>list data structure</Highlight>.
            </p>

            <p>
                A <Highlight>list</Highlight> is a collection of elements arranged in order. Each element has a position, and you can access, add, or remove elements based on that order. Lists are one of the most fundamental data structures because they allow us to group data and work with it as a sequence.
            </p>

            <ListSection title="Lists come in two main forms:">
                <li>Static lists → fixed in size (commonly implemented as <strong>Arrays</strong>).</li>
                <li>Dynamic lists → can grow or shrink as needed (commonly implemented as <strong>ArrayLists</strong>).</li>
            </ListSection>

            <p>
                This distinction between <Highlight>static</Highlight> and <Highlight>dynamic</Highlight> lists is the foundation for understanding how arrays and ArrayLists work.
            </p>

        </section>
    )
}

function Array() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Array</Heading>

            <p>
                An <Highlight>array</Highlight> is a collection of items stored in <Highlight>contiguous (side-by-side) memory locations</Highlight>. Each item in an array is called an <Highlight>element</Highlight>, and every element can be accessed directly using its <Highlight>index</Highlight> (a number that represents its position in the array).
            </p>

            <p>
                INSERT IMAGE HERE
            </p>

            <ListSection title="Arrays are useful because they:">
                <li><strong>Keep data organized</strong> - in a single variable instead of many separate ones.</li>
                <li><strong>Provide fast access</strong> - since the index can directly calculate the memory address of an element.</li>
                <li><strong>Store elements of the same type</strong> - making them efficient and predictable.</li>
            </ListSection>

            <p>
                The main limitation of arrays is that their size is <Highlight>fixed when created</Highlight>. If you need more space or fewer elements, you cannot simply resize the array, you would need to make a new one.
            </p>



        </section>
    )
}

function Array_List() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Array List</Heading>
            <p>
                An <Highlight>ArrayList</Highlight> is a type of <Highlight>dynamic array</Highlight>. It is a collection that can automatically <Highlight>grow</Highlight> or <Highlight>shrink</Highlight> as you add or remove elements.
            </p>

            <p>
                INSERT IMAGE HERE
            </p>

            <ListSection title="The key difference between a regular array and a dynamic array is:">
                <li><strong>Regular arrays</strong> - have a fixed size. Once created, their length cannot change.</li>
                <li><strong>Dynamic arrays</strong> - can adjust their size automatically, which makes them more flexible.</li>
            </ListSection>

            <p>
                Because of this, an ArrayList combines the <Highlight>fast access</Highlight> of arrays with the <Highlight>flexibility</Highlight> of automatically resizing when needed.
            </p>

            <p>
                This makes ArrayLists one of the most commonly used data structures in programming, especially when you do not know in advance how many items you will need to store.
            </p>

        </section>
    );
}
function CommonOperations() { }
function Drawbacks() { }
function UseCase() { }
function Examples() { }
function Why() { }
function Resources() { }