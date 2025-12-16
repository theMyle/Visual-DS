import Heading from "../components/Heading";
import Highlight from "../components/Highlight";
import ListSection from "../components/ListSection";
import BottomNav from "../components/BottomNav";

export default function IntroductionPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">
        <WhatIsDS />
        <WhyLearnDS />
        <WhyChoosingDSMatters />
      </main>
      <BottomNav
        next={{ href: "/lesson/big-o", label: "Big-O" }}
      />
    </div>
  );
}


function WhatIsDS() {
  return (
    <section className="flex flex-col gap-4 leading-relaxed">

      <Heading>What is a Data Structure?</Heading>

      <p>
        A <Highlight>data structure</Highlight> is a specific way
        of <Highlight>organizing</Highlight> and <Highlight>storing</Highlight> data so it can be used efficiently.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p>
        In programming, different data structures such as arrays, stacks, queues, and trees
        are designed for different ways of finding, adding,
        or removing items.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p className="mb-4 bg-blue-50 rounded-xl p-4">
        The choice of data structure directly affects how fast
        and efficiently you can work with your data.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>
    </section>
  );
}


function WhyLearnDS() {
  return (
    <section className="flex flex-col gap-5 leading-relaxed">

      <Heading>Why Learn Data Structures?</Heading>

      <p>
        Data structures are the backbone of efficient programming.
        They define how your data is arranged in memory and how algorithms interact with it.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p>
        The same algorithm can run quickly or painfully slowly
        depending on the structure it works with and some algorithms
        can only be applied to specific types of structures.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p>
        Each data structure models data in its own way, with its own strengths and weaknesses.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p>
        They are the tools you use to solve programming problems, and understanding them is crucial to writing
        fast, reliable, and scalable software.
      </p>

      <ListSection title="Learning data structures gives you the ability to:">
        <li>Pick the right model for your data.</li>
        <li>Use the algorithms that work best for that model.</li>
        <li>Design solutions that are both efficient and scalable.</li>
      </ListSection>

    </section>
  );
}


function WhyChoosingDSMatters() {
  return (
    <section className="flex flex-col gap-5 leading-relaxed">

      <Heading>Why Choosing The Right Data Structure Matters</Heading>

      <ListSection title="Every data structure is designed for certain operations and trade-offs:">
        <li>Looking up a user’s account by their ID instantly → <span className="font-semibold">Hash Map</span></li>
        <li>Accessing the 100th frame in a video file directly → <span className="font-semibold">Array</span></li>
        <li>Undoing the last move in a drawing app → <span className="font-semibold">Stack</span></li>
        <li>Processing customer orders in the sequence they were received → <span className="font-semibold">Queue</span></li>
      </ListSection>

      <p className="border-l-3 border-red-200 pl-4 mb-4">
        Pick the wrong structure, and you might be sorting through
        thousands of records when you could have jumped straight to the answer.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p className="border-l-3 border-green-200 pl-4 mb-4">
        Pick the right one, and your program runs faster, uses less memory,
        and scales more easily as your data grows.
        <sup className="text-xs text-gray-500 ml-1">[1]</sup>
      </p>

      <p className="mb-4 bg-blue-50 rounded-xl p-4">
        Learning data structures isn’t about memorizing names,
        it’s about matching the right tool to the real-world problem you’re solving.
      </p>

      <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p className="leading-relaxed">
          <strong>References:</strong><br />
          [1] Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022).
          <em> Introduction to Algorithms</em> (4th ed.). MIT Press. Chapter 10: Elementary Data Structures.
        </p>
      </div>
    </section>
  );
}