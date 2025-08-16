import Link from "next/link";

const accentColor = "#94A6FF";

export default function IntroductionPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
        <WhatIsDS />
        <WhyLearnDS />
        <WhyChoosingDSMatters />
      </main>
      <BottomNav />
    </div>
  );
}


function WhatIsDS() {
  return (
    <section className="flex flex-col gap-4 leading-relaxed">

      <Heading text="What is a Data Structure?" />

      <p>
        A <Highlight text="data structure" /> is a specific way
        of <Highlight text="organizing" /> and <Highlight text="storing" /> data so it can be used efficiently.
      </p>

      <p>
        In programming, different data structures such as arrays, stacks, queues, and trees
        are designed for different ways of finding, adding,
        or removing items.
      </p>

      <p className="mb-4 bg-blue-50 rounded-xl p-2">
        The choice of data structure directly affects how fast
        and efficiently you can work with your data.
      </p>
    </section>
  );
}


function WhyLearnDS() {
  return (
    <section className="flex flex-col gap-5 leading-relaxed">

      <Heading text="Why Learn Data Structures?" />

      <p>
        Data structures are the backbone of efficient programming.
        They define how your data is arranged in memory and how algorithms interact with it.
      </p>

      <p>
        The same algorithm can run quickly or painfully slowly
        depending on the structure it works with and some algorithms
        can only be applied to specific types of structures.
      </p>

      <p>
        Each data structure models data in its own way, with its own strengths and weaknesses.
      </p>

      <p>
        They are the tools you use to solve programming problems, and understanding them is crucial to writing
        fast, reliable, and scalable software.
      </p>

      <ListSection
        title="Learning data structures gives you the ability to:"
        items={[
          <>Pick the right model for your data.</>,
          <>Use the algorithms that work best for that model.</>,
          <>Design solutions that are both efficient and scalable.</>,
        ]} />

    </section>
  );
}


function WhyChoosingDSMatters() {
  return (
    <section className="flex flex-col gap-5 leading-relaxed">

      <Heading text="Why Choosing The Right Data Structure Matters" />

      <ListSection
        title="Every data structure is designed for certain operations and trade-offs:"
        items={[
          <>Looking up a user’s account by their ID instantly → <span className="font-semibold">Hash Map</span></>,
          <>Accessing the 100th frame in a video file directly → <span className="font-semibold">Array</span></>,
          <>Undoing the last move in a drawing app → <span className="font-semibold">Stack</span></>,
          <>Processing customer orders in the sequence they were received → <span className="font-semibold">Queue</span></>,
        ]} />

      <p className="border-l-3 border-red-200 pl-4 mb-4">
        Pick the wrong structure, and you might be sorting through
        thousands of records when you could have jumped straight to the answer.
      </p>

      <p className="border-l-3 border-green-200 pl-4 mb-4">
        Pick the right one, and your program runs faster, uses less memory,
        and scales more easily as your data grows.
      </p>

      <p className="mb-4 bg-blue-50 rounded-xl p-4">
        Learning data structures isn’t about memorizing names,
        it’s about matching the right tool to the real-world problem you’re solving.
      </p>
    </section>
  );
}


function BottomNav() {
  return (
    <nav className="flex justify-end py-6 px-5 max-w-3xl mx-auto">
      <Link href={"/lessons/time-space-complexity"}>
        <span
          className="text-base underline hover:opacity-80 transition-opacity"
          style={{ color: accentColor }}
        >
          Time & Space Complexity →
        </span>
      </Link>
    </nav>
  );
}


function Heading({ text }: { text: string }) {
  return (
    <h1
      className="text-2xl md:text-2xl lg:text-3xl font-bold tracking-wide border-l-4 pl-3 mb-2"
      style={{ borderColor: accentColor, color: accentColor }}
    >
      {text}
    </h1>
  );
}


function Highlight({ text }: { text: string }) {
  return (<span className="bg-blue-50 rounded-xl px-2">{text}</span>);
}


function ListSection({
  title,
  items,
}: {
  title?: string;
  items: React.ReactNode[];
}) {
  return (
    <div className="mb-4">
      {title && (
        <p className="leading-relaxed mb-2 font-medium">{title}</p>
      )}
      <ul className="list-disc pl-8 bg-blue-50 py-4 rounded-xl">
        {items.map((item, i) => (
          <li key={i} className="mb-2 pr-4">{item}</li>
        ))}
      </ul>
    </div>
  );
}
