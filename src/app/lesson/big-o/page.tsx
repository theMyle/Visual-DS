import { SECTION_CLASS } from "../components/constants";
import ListSection from "../components/ListSection";
import Highlight from "../components/Highlight";
import Heading from "../components/Heading";
import TableSection from "../components/TableSection";
import VideoEmbed from "../components/VideoEmbed";
import BottomNav from "../components/BottomNav";

export default function BigO() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
        <BigONotation />
        <WhatDoesNAndWorkMean />
        <HowToReadBigO />
        <FirstExample />
        <CommonBigOClasses />
        <WhyThisMatters />
        <AdditionalResources />
      </main>
      <BottomNav
        prev={{ href: "/lesson/introduction", label: "Introduction" }}
        next={{ href: "/lesson/arraylist", label: "Array List" }}
      />
    </div>
  );
}


function BigONotation() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>Big-O Notation</Heading>

      <p>
        Back in 1894, mathematician Paul Bachmann introduced Big-O
        notation to describe how a function grows.
      </p>

      <p>
        In computer science, we use it to talk about how algorithms
        scale,  without worrying about the hardware, language, or exact seconds.
      </p>

      <ListSection title="Big-O focuses on the rate of growth">
        <li>If we double the input size, how does the work grow?</li>
        <li>Will it double, quadruple, or barely change?</li>
      </ListSection>

      <p>
        It is usually used to describe the <Highlight>worst-case</Highlight> scenario,
        so we know the slowest performance we might face, like a safety guarantee.
        It tells us the slowest performance we should expect, ensuring that even in
        the toughest situations, things won’t be worse than that.
      </p>
    </section>
  );
}


function WhatDoesNAndWorkMean() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>What do 'n' and 'work' mean?</Heading>

      <p>
        <Highlight>n</Highlight> is the size of the input. Think: how many things are we operating on?
      </p>

      <ListSection title="Examples of n">
        <li>Array length (number of elements)</li>
        <li>String length (number of characters)</li>
        <li>Number of nodes in a tree/graph</li>
        <li>For matrices, sometimes <em>n</em> is one dimension (e.g., n×n)</li>
      </ListSection>

      <p>
        <Highlight>work</Highlight> is the count of basic operations an algorithm performs (its “steps”).
      </p>

      <ListSection title="Examples of work (primitive steps)">
        <li>Reading or writing a value</li>
        <li>Comparing two values</li>
        <li>Simple arithmetic (add, subtract, multiply, divide)</li>
        <li>Following a pointer/reference</li>
      </ListSection>

      <p>
        Big-O asks: <Highlight>"If n changes, how does the work change?"</Highlight>
      </p>

      <p>
        Big-O tells you the trend of how work grows as <Highlight>n</Highlight> increases. We ignore
        constants and lower-order terms and focus on the dominant growth.
      </p>
    </section>
  );
}


function HowToReadBigO() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>How to Read Big-O</Heading>

      <p>
        You will see things like <Highlight>O(n)</Highlight> or <Highlight>O(n²)</Highlight>.
      </p>

      <ListSection>
        <li><strong>O(n)</strong> → work grows in direct proportion to n.</li>
        <li><strong>O(n²)</strong> → work grows with the square of n.</li>
      </ListSection>

      <ListSection title="When simplifying expressions:">
        <li>Drop constants: O(5n) → O(n)</li>
        <li>Keep only the dominant term: O(n² + n) → O(n²)</li>
      </ListSection>

    </section>
  );
}


function FirstExample() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>A first Big-O example</Heading>

      <p>Suppose we want the sum of all numbers in an array:</p>

      <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm">
        <code>{`function sum(arr: number[]) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}`}</code>
      </pre>

      <p className="italic text-slate-700">Question: What is the running time of this algorithm?</p>

      <p>
        It goes through the array once. If there are <Highlight>n</Highlight> items, it does about <Highlight>n</Highlight> steps. That means the running time grows in a straight line with n. This is <strong>O(n)</strong>.
      </p>

      <ListSection title="Quick intuition">
        <li>The loop runs n times. (n is the size of the array)</li>
        <li>Each pass does a tiny, fixed amount of work.</li>
        <li>More items → proportionally more work → O(n).</li>
      </ListSection>

      <p>
        Another way to say it: the loop goes from index <code>0</code> up to <code>n - 1</code> and
        touches every element once. If there are <Highlight>n</Highlight> elements, there are <Highlight>n</Highlight> visits. Work grows in direct proportion to how many elements we
        touch, so we call that <strong>O(n)</strong>.
      </p>

      <p>
        In Big-O, we ignore constants and lower-order terms. Different machines or languages may
        change the constants, but the <em>shape</em> of growth stays linear for this algorithm.
      </p>
    </section>
  );
}


function CommonBigOClasses() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>Common Big-O Classes</Heading>

      <TableSection
        headers={["Class", "Name", "Example"]}
        rows={[
          ["O(1)", "Constant", "Accessing an array element"],
          ["O(log n)", "Logarithmic", "Binary search"],
          ["O(n)", "Linear", "Simple loop through array"],
          ["O(n²)", "Quadratic", "Nested loops"],
          ["O(2ⁿ)", "Exponential", "Recursive Fibonacci"],
        ]}
      />
    </section>
  );
}


function WhyThisMatters() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>Why This Matters</Heading>

      <p>
        Understanding Big-O helps you predict how your program will perform
        as data grows, compare different algorithms, choose the right data
        structures, and write solutions that stay fast and scalable.
      </p>

    </section>
  );
}

function AdditionalResources() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>Additional Resources</Heading>

      <VideoEmbed embedUrl="https://www.youtube.com/embed/g2o22C3CRfU?si=9cgniOmwWFwCfkpU" title="Big-O Notation in 100 Seconds" />
    </section>
  )
}