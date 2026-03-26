import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";
import ListSection from "../../components/ListSection";
import CodeBlock from "../../components/CodeBlock";
import TextLink from "../../components/TextLink";
import TableSection from "../../components/TableSection";

export default function WhatIsAnArray() {
    const slug = "array";
    const title = "array-operations";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <ArrayOperations />
                <AccessAndUpdate />
                <Insertion />
                <Deletion />
                <TraversalAndSearch />
                <OperationComplexityTable />
                {/* <RealworldVsTheory /> */}

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/types-of-array`, label: "Types of Array" }}
                next={{ href: `/lesson`, label: "Lesson Page" }}
            />
        </div>
    );
}

function ArrayOperations() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Array Operations</Heading>

            <p>
                Since static arrays cannot change in size, most discussion regarding "dynamic" operations (like adding or removing) actually describes the mechanics of Dynamic Arrays (like ArrayList or Python Lists). These structures automate the heavy lifting of memory management so the user doesn't have to manually create new arrays.
            </p>

            <ListSection title="Common Array Operations" ordered={true}>
                <li>Access & Update</li>
                <li>Insertion</li>
                <li>Deletion</li>
                <li>Traversal & Search</li>
            </ListSection>
        </section>
    )
}

function AccessAndUpdate() {
    const codeExample1 = `#include <iostream>

int main() {
    // Accessing an element in a fixed-size array
    int staticArr[5] = {1, 2, 3, 4, 5};
    std::cout << staticArr[0] << '\\n'; // prints: 1
    return 0;
}`;

    const codeExample2 = `#include <iostream>
#include <vector>

int main() {
    // Updating an element in a dynamic array (vector)
    std::vector<int> dynamicArr = {10, 20, 30, 40, 50};
    dynamicArr[4] = 100;

    for (int x : dynamicArr) {
        std::cout << x << " ";
    }
    std::cout << '\\n'; // Result: 10 20 30 40 100

    return 0;
}`;

    return (
        <section className={SECTION_CLASS}>
            <Heading>Access And Update</Heading>

            <p>
                These are the fastest operations for an array. Since an array is a contiguous block of memory, the computer doesn't need to "search" for a position. It uses the index to calculate the exact physical memory address instantly (BaseAddress + Index). Whether you are reading a value (Access) or overwriting it (Update), it takes the same amount of effort regardless of the array's size
            </p>

            <CodeBlock
                language="c++"
                code={codeExample1}
            />

            <CodeBlock
                language="c++"
                code={codeExample2}
            />

        </section>
    )
}

function Insertion() {
    const sampleCode1 = `#include <iostream>
#include <vector>

int main() {
    // Insertion at the end
    std::vector<int> nums = {1, 2, 3, 4, 5};
    nums.push_back(6);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\\n'; // Result: 1 2 3 4 5 6

    return 0;
}`;

    const sampleCode2 = `#include <iostream>
#include <vector>

int main() {
    // Insertion at the front
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.insert(nums.begin(), 5);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\\n'; // Result: 5 10 20 30 40 50

    return 0;
}`;

    const sampleCode3 = `#include <iostream>
#include <vector>

int main() {
    // Insertion around middle (at index 2)
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.insert(nums.begin() + 2, 100);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\\n'; // Result: 10 20 100 30 40 50

    return 0;
}`;

    return (
        <section className={SECTION_CLASS}>
            <Heading>Insertion</Heading>

            <ListSection>
                <li>
                    <strong>Insertion at the end</strong>: This is usually very fast <strong>O(1)</strong>. You are simply placing a value into the next available slot. The only exception is when the underlying dynamic array is full and must "resize," but in daily use, we treat this as <TextLink
                        href="https://en.wikipedia.org/wiki/Amortized_analysis"
                        target="_blank"
                        rel="noopener noreferrer"
                    >amortized</TextLink> constant-time operation.
                </li>

                <li>
                    <strong>Insertion at front or middle</strong>: This is an "<em>expensive</em>" operation <strong>O(n)</strong>. Because there are no gaps allowed between items, you have to manually <strong>shift</strong> to the right every single element that comes after your new spot to make a hole. If you have a thousand items and want to put one at the very front, you have to move all one thousand items first. Imagine having a million items.
                </li>
            </ListSection>

            <CodeBlock
                language="c++"
                code={sampleCode1}
            />

            <CodeBlock
                language="c++"
                code={sampleCode2}
            />

            <CodeBlock
                language="c++"
                code={sampleCode3}
            />
        </section>
    )
}

function Deletion() {
    const sampleCode1 = `#include <iostream>
#include <vector>

int main() {
    // Deletion at the end: fast (no shifting needed)
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.pop_back();

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\\n'; // Result: 10 20 30 40

    return 0;
}`;

    const sampleCode2 = `#include <iostream>
#include <vector>

int main() {
    // Deletion in the middle (removes the element at index 2)
    std::vector<int> nums = {10, 20, 30, 40, 50};
    nums.erase(nums.begin() + 2);

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\\n'; // Result: 10 20 40 50

    return 0;
}`;

    return (
        <section className={SECTION_CLASS}>
            <Heading>Deletion</Heading>

            <ListSection>
                <li>
                    <strong>Deletion at the end</strong>: Like insertion at the end, this is very fast <strong>O(1)</strong>. You simply remove the last item or tell the array to ignore that slot. No other elements are affected.

                </li>
                <li>
                    <strong>Deletion at front or middle</strong>: This is an expensive operation as list grows <strong>O(n)</strong>. When you remove an element from the middle, it leaves a "hole" in the memory block. To keep the data contiguous, you must shift to the left every subsequent element to fill that slot.
                </li>
            </ListSection>

            <CodeBlock
                language="c++"
                code={sampleCode1}
            />

            <CodeBlock
                language="c++"
                code={sampleCode2}
            />
        </section>
    )
}

function TraversalAndSearch() {
    const sampleCode1 = `#include <iostream>

int main() {
    // Traversal: printing every element
    int nums[] = {1, 2, 3, 4, 5};

    for (int x : nums) {
        std::cout << x << " ";
    }
    std::cout << '\\n';

    return 0;
}`;

    const sampleCode2 = `#include <iostream>

int main() {
    // Search: finding a specific value (linear search)
    int nums[] = {10, 20, 30, 40, 50};
    int target = 30;
    bool found = false;

    for (int x : nums) {
        if (x == target) {
            found = true;
            break;
        }
    }

    if (found) {
        std::cout << "Found 30!" << '\\n';
    } else {
        std::cout << "Item not found" << '\\n';
    }

    return 0;
}`;

    return (
        <section className={SECTION_CLASS}>
            <Heading>Traversal & Search</Heading>

            <ListSection>
                <li>
                    <strong>Traversal</strong>: This is the act of visiting every element in the array once (e.g., printing all items). Because you must visit every item in the list, this operation has a complexity of <strong>O(n)</strong>.
                </li>

                <li>
                    <strong>Search</strong>: This is a traversal with a condition. In an unsorted array, you perform a <em>linear search</em> by checking each item one by one starting at index 0. In the worst-case scenario, the item is at the very end or not there at all, requiring <strong>n steps</strong> to finish. This makes it an <strong>O(n)</strong> operation.
                </li>
            </ListSection>

            <CodeBlock
                language="c++"
                code={sampleCode1}
            />

            <CodeBlock
                language="c++"
                code={sampleCode2}
            />
        </section>
    )
}

function OperationComplexityTable() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Array Operations Complexity Table</Heading>

            <TableSection
                headers={["Array Operation", "Complexity"]}
                rows={[
                    ["Access", "O(1)"],
                    ["Update", "O(1)"],
                    ["Insert Front", "O(n)"],
                    ["Insert Middle", "O(n)"],
                    ["Insert End", "O(1)"],
                    ["Delete Front", "O(n)"],
                    ["Delete Middle", "O(n)"],
                    ["Delete End", "O(1)"],
                    ["Traversal", "O(n)"],
                    ["Search (unsorted)", "O(n)"],
                ]}
            />

            <p>
                The required <strong>shifting</strong> makes arrays a poor fit for frequent inserts or deletes at the <strong>beginning</strong> and <strong>middle</strong> as arrays grow larger. However, arrays are excellent for fast <TextLink
                    href="https://en.wikipedia.org/wiki/Random_access"
                    target="_blank"
                >random access</TextLink> (direct access) no matter what the size is. This trade-off is exactly why we study other data structures: one structure’s weakness is often another’s strength.
            </p>
        </section>
    )
}

function RealworldVsTheory() {
    return (
        <section className={SECTION_CLASS}>
            <Heading>Real-World vs. Theory</Heading>

            <p>
                In the study of Data Structures, we use Big-O to measure the growth of operations rather than actual, real-world speed. On paper, shifting elements is considered "expensive" because every new item you add makes the task take more steps.
            </p>

            <p>
                However, for small collections; like a few hundred items; this slowdown is negligible. Modern computers move contiguous blocks of data so fast that you likely won't notice a delay. The performance hit only becomes obvious when your data grows into the tens of thousands or when you perform these shifts thousands of times per second.
            </p>

            <p>
                The Lesson: Arrays are the best "default" tool, but Big-O warns us that they don't scale well for specific tasks. If your project involves constantly shoving items into the front of a massive list, the "growth" will eventually break your performance. We study these structures so we know exactly when a list has grown too large for an array and it’s time to switch to a more efficient tool.
            </p>

        </section>
    )
}