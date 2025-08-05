import Link from "next/link"

export default function IntroductionPage() {
  return(
    <div>
      <UpperNav />

      <main className={"flex flex-col gap-6 px-4 py-6"}>
        <WhatIsDS/>
        <WhyLearnDS/>
      </main>

      <BottomNav/>
    </div>
  )
}


function WhatIsDS() {
  return(
    <section className={"flex flex-col gap-4"}>
      <h1 className={"text-2xl font-bold"}>
        What is a Data Structure?
      </h1>

      <p>
        A data structure is simply <span className="font-bold"> a way to structure and organize data </span>
        so that it is easier to work with.
      </p>

      <p>
        Think of it like a container.
      </p>

      <p>
      Not all containers are the same, some are great for keeping things in order,
        some are better for looking something up quickly, and others are built for 
          frequent insertion and deletion of items.
      </p>
    </section>
  )
}


function WhyLearnDS() {
  return(
    <section className={"flex flex-col gap-4"}>
      <h1 className={"text-2xl font-bold"}>
      Why learn Data Structures?
      </h1>

      <p>
      Imagine you're packing for a trip. You’ve got chargers, snacks, notebooks, and electronics.
      Toss everything into one big bag, and you'll spend forever digging for your charger.
      </p>

      <p>
      Now imagine you organize it properly:
      </p>

      <ul className={"list-disc pl-6"}>
          <li>Electronics in one pocket.</li>
          <li>Notebooks in another.</li>
          <li>Snacks in a ziplock.</li>
      </ul>

      <p>
      All of a sudden, it's much faster and easier to find exactly what you need.
      </p>

      <p>
      That's what data structures do in programming. 
      They help you organize and store data in a way that makes operations, 
      like searching, sorting, or updating, more efficient.
      </p>

      <p>
      But the key isn’t just that things are organized, it’s <span className="font-bold">how they are organized</span> for specific tasks.
      </p>

      <p>
      Every data structure is built to make certain operations fast and efficient. It’s not just about storing data, it’s about what you can do with it, and how fast.
      </p>

      <ul className={"list-disc pl-6 flex flex-col gap-2"}>
        <li>
          Need to check if a user exists by email quickly in a large dataset?  
          Use a <span className="font-bold">map</span>.
        </li>
        <li>
          Need to access the 10th item instantly?  
          Use an <span className="font-bold">array</span>.
        </li>
        <li>
          Need to undo the last action?  
          Use a <span className="font-bold">stack</span>.
        </li>
        <li>
          Need to process tasks in the order they arrive?  
          Use a <span className="font-bold">queue</span>. 
        </li>
      </ul>

      <p>
      Use the wrong structure and your code slows down, becomes harder to scale.
      </p>

      <p>
      Use the right one, and your code is faster, cleaner, and easier to maintain 
      especially as your data grows.
      </p>

      <p>
      Learning data structures isn’t about memorizing definitions. 
      It’s about recognizing what operations your system needs and 
      picking the structure that makes those operations cheap.
      </p>

    </section>
  )
}

function BottomNav() {
  return(
    <nav className="flex justify-end pb-4 px-2">
      <Link href={"/lessons/time-space-complexity"}>
        <span className="text-sm text-gray-400 underline">Time & Space Complexity →</span>
      </Link>
    </nav>
  )
}

function UpperNav() {
  return(
    <nav className={"border-b-[1.8px] sticky top-0 z-0 w-full bg-white px-2"}>

    <span className={"text-sm text-gray-400 "}>
      <Link href={"/lesson"} className={"underline"}>
        Lesson
      </Link> 
      {' > '}
      <Link href={"/lesson/introduction"} className={"underline"}>
        Introduction to Data Structures
      </Link> 
    </span>
    </nav>
  )
}
