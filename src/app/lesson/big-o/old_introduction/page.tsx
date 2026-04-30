import Heading from "../../components/Heading";
import MarkAsDone from "../../components/MarkAsDone";
import BottomNav from "../../components/BottomNav";
import ListSection from "../../components/ListSection"; // Assuming the path
import BackButton from "@/app/components/BackButton";
import { SECTION_CLASS } from "../../components/constants";

export default function BigOIntroduction() {
    const slug = "big-o";
    const title = "introduction";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                <Heading>Introduction</Heading>
                <Body />
                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                next={{ href: "/lesson/big-o/big-o-notation", label: "Big-O Notation" }}
            />
        </div>
    );
}

function Body() {
    return (
        <section className={SECTION_CLASS}>
            <p>
                Welcome to the Big - O module. Before we dive into specific code examples, it's important to understand the high-level goals of this section.
            </p >

            <ListSection title="In this module we will learn about:">
                <li>Big-O Notation basics</li>
                <li>Common Growth Rates</li>
                <li>Basic Big-O Analysis of real code</li>
                <li>Why Constants are ignored in theoretical scaling</li>
            </ListSection>

            <p>
                There are a lot of existing algorithms; some are fast and some are slow.
                Some use lots of memory. It can be hard to decide which algorithm is the
                best to solve a particular problem.
            </p>

            <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-600">
                "Big O" analysis is a standardized way to compare the practicality of
                algorithms by classifying their time complexity based on worst-case growth rates.
            </blockquote>
        </section >
    )
}