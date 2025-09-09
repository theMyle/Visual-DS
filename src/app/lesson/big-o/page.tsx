import Link from "next/link";
import { ACCENT_COLOR } from "@/app/lib/constants";
import { SECTION_CLASS } from "../components/constants";
import ListSection from "../components/ListSection";
import Highlight from "../components/Highlight";
import Heading from "../components/Heading";
import TableSection from "../components/TableSection";

export default function BigO() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
        <BigONotation />
        <WhatDoesNAndWorkMean />
        <HowToReadBigO />
        <CommonBigOClasses />
        <WhyThisMatters />
      </main>
      <BottomNav />
    </div>
  );
}


function BottomNav() {
  return (
    <nav className="flex justify-between py-6 px-5 max-w-3xl mx-auto">
      <Link href={"/lesson/introduction"}>
        <span
          className="text-base underline hover:opacity-80 transition-opacity"
          style={{ color: ACCENT_COLOR }}
        >
          ← Introduction
        </span>
      </Link>
      <Link href={"/lesson/arraylist"}>
        <span
          className="text-base underline hover:opacity-80 transition-opacity"
          style={{ color: ACCENT_COLOR }}
        >
          Array List →
        </span>
      </Link>
    </nav>
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
      <Heading>What Does 'n' and 'work' Mean</Heading>

      <p>
        <Highlight>n</Highlight> is size of the input like items in a list or collection.
      </p>

      <p>
        <Highlight>work</Highlight> is the count of basic operations an algorithm performs like reading/writing to memory, accessign and item/element and so on.
      </p>

      <p>
        Big-O asks: <Highlight>"If n changes, how does the work change?"</Highlight>
      </p>

      <p>
        Big-O tells you the general trend of how work grows as <Highlight>n</Highlight> increases.
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
