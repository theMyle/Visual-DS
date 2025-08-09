import Link from "next/link";

const accentColor = "#94A6FF"; // matches your logo exactly

export default function IntroductionPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <main className="flex flex-col gap-20 px-5 py-10 max-w-3xl mx-auto">
        <WhatIsDS />
        <WhyLearnDS />
      </main>
      <BottomNav />
    </div>
  );
}

function WhatIsDS() {
  return (
    <section className="flex flex-col gap-5 text-[18px] md:text-[20px] leading-relaxed">
      <h1
        className="text-4xl font-semibold tracking-wide"
        style={{ color: accentColor }}
      >
        What is a Data Structure?
      </h1>

      <p>
        A data structure is simply{" "}
        <span className="font-semibold">
          a way to structure and organize data
        </span>{" "}
        so that it is easier to work with.
      </p>

      <p>Think of it like a container.</p>

      <p>
        Not all containers are the same—some are great for keeping things in
        order, some are better for looking something up quickly, and others are
        built for frequent insertion and deletion of items.
      </p>
    </section>
  );
}

function WhyLearnDS() {
  return (
    <section className="flex flex-col gap-6 text-[18px] md:text-[20px] leading-relaxed">

      {/* Heading */}
      <h1
        className="text-4xl font-semibold tracking-wide"
        style={{ color: accentColor }}
      >
        Why Learn Data Structures?
      </h1>

      {/* Real-life analogy */}
      <div className="space-y-4">
        <p>
          Imagine you're packing for a trip. You’ve got chargers, snacks,
          notebooks, and electronics. Toss everything into one big bag, and
          you’ll spend forever digging for your charger.
        </p>

        <p>Now imagine you organize it properly:</p>

        <ul className="list-disc pl-6 space-y-2" style={{ color: accentColor }}>
          <li className="text-gray-800">Electronics in one pocket.</li>
          <li className="text-gray-800">Notebooks in another.</li>
          <li className="text-gray-800">Snacks in a ziplock.</li>
        </ul>

        <p>
          Suddenly, it’s much faster and easier to find exactly what you need.
        </p>
      </div>

      {/* Programming connection */}
      <div className="space-y-4">
        <p>
          That’s what data structures do in programming—they help you organize
          and store data so operations like searching, sorting, or updating are
          more efficient.
        </p>
        <p>
          But the key isn’t just that things are organized, it’s{" "}
          <span className="font-semibold">how they are organized</span> for
          specific tasks.
        </p>
        <p>
          Every data structure is built to make certain operations fast and
          efficient. Use the wrong one, and your code slows down. Use the right
          one, and it’s faster, cleaner, and easier to maintain—especially as
          your data grows.
        </p>
      </div>

      {/* Practical examples */}
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2" style={{ color: accentColor }}>
          <li className="text-gray-800">
            Need to check if a user exists by email quickly in a large dataset?
            Use a <span className="font-semibold">map</span>.
          </li>
          <li className="text-gray-800">
            Need to access the 10th item instantly? Use an{" "}
            <span className="font-semibold">array</span>.
          </li>
          <li className="text-gray-800">
            Need to undo the last action? Use a{" "}
            <span className="font-semibold">stack</span>.
          </li>
          <li className="text-gray-800">
            Need to process tasks in the order they arrive? Use a{" "}
            <span className="font-semibold">queue</span>.
          </li>
        </ul>
      </div>

      {/* Closing note */}
      <p>
        Learning data structures isn’t about memorizing definitions—it’s about
        recognizing what operations your system needs and picking the structure
        that makes those operations cheap.
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
