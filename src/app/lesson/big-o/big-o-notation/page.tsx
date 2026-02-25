import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import TableSection from "../../components/TableSection";
import VideoEmbed from "../../components/VideoEmbed";
import BottomNav from "../../components/BottomNav";
import Image from "next/image";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";

export default function BigO() {
  const slug = "big-o";
  const title = "big-o-notation";
  const href = `/lesson/${slug}/${title}`;

  return (
    <div className="bg-white text-gray-800 font-sans">
      <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

        <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
        <BigONotation />
        <CommonBigOClasses />
        <BigOAnalysis />
        <MarkAsDone categorySlug={slug} href={href} />

      </main>
      <BottomNav
        prev={{ href: "/lesson/big-o/introduction", label: "Introduction" }}
      />
    </div>
  );
}


function BigONotation() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>Big-O Notation</Heading>

      <p>
        First introduced by mathematician Paul Bachmann in 1894, <strong>Big-O notation</strong> has become the universal language for measuring algorithmic efficiency.
      </p>

      <p>
        In computer science, it allows us to compare how algorithms scale without getting
        bogged down by specific hardware, programming languages, or clock speeds.
      </p>

      <blockquote>
        Big-O characterizes an algorithm’s <strong>worst-case growth rate</strong>; telling us exactly how much more time or
        memory is required as the input size (<strong>n</strong>) increases.
      </blockquote>

      <p>
        We write it as <strong><code>O(n)</code></strong>, where <strong>n</strong> is a formula representing
        the growth curve.
      </p>


    </section >
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
          ["O(n!)", "Factorial", "Factorial"],
        ]}
      />

      <p>
        The following chart shows the growth rate of several different Big-O categories. The size of the input is shown on the <strong>x - axis</strong> and how long the algorithm will take to complete is shown on the <strong>y - axis</strong>.
      </p>

      <div className="flex justify-center p-4">
        <Image
          src={"/lessons/big-o-chart.png"}
          alt="Big-O Chart"
          width={1600}
          height={900}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <p>
        As the size of inputs grows, the algorithms become slower to complete (take longer to run). The rate at which they become slower is defined by their Big-O category.
      </p>

      <p>
        For example, O(n) algorithms slow down more slowly than O(n²) algorithms.
      </p>

    </section>
  )
}

function BigOAnalysis() {
  return (
    <section className={SECTION_CLASS}>
      <Heading>Big-O Analysis</Heading>

      <VideoEmbed
        embedUrl="https://storage.googleapis.com/qvault-webapp-dynamic-assets/lesson_videos/big-o-notation-v1-23-00-x264-1920x1080.mp4"
      ></VideoEmbed>
    </section>
  )
}