
import BottomNav from "../../components/BottomNav";
import { SECTION_CLASS } from "../../components/constants";
import Heading from "../../components/Heading";
import ListSection from "../../components/ListSection";
import MarkAsDone from "../../components/MarkAsDone";
import BackButton from "@/app/components/BackButton";
import VideoEmbed from "../../components/VideoEmbed";

export default function WhatIsAnAlgorithmPage() {
    const slug = "introduction";
    const title = "what-is-an-algorithm";
    const href = `/lesson/${slug}/${title}`;

    return (
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-16 px-4 pt-8 text-base md:text-lg max-w-3xl mx-auto">

                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />

                <WhatIsAnAlgorithm />

                <MarkAsDone categorySlug={slug} href={href} />

            </main>
            <BottomNav
                prev={{ href: `/lesson/${slug}/introduction`, label: "Introduction" }}
                next={{ href: `/lesson/${slug}/what-is-a-ds`, label: "What is a Data Structure" }}
            />
        </div>
    );
}

function WhatIsAnAlgorithm() {
    return (
        <section className={SECTION_CLASS}>

            <Heading>What is an Algorithm</Heading>

            <p>
                In the context of computer science, an algorithm is a finite sequence of well-defined, computer-implementable instructions. In short, an algorithm is:
            </p>

            <ListSection>
                <li>
                    Defined: there is a specific sequence of steps that performs a task
                </li>

                <li>
                    Unambiguous: there is a "correct" and "incorrect" interpretation of the steps
                </li>
                <li>
                    Implementable: it can be executed using software and hardware
                </li>
            </ListSection>

            <p>
                Algorithms are usually written in "pseudocode" because an algorithm is a higher-level description of a solution to a problem. An algorithm doesn't care if it's implemented in Python, Go, TypeScript, or Java. Pseudocode is just plain English that describes the steps of the algorithm.
            </p>

            <VideoEmbed embedUrl="https://storage.googleapis.com/qvault-webapp-dynamic-assets/lesson_videos/what-are-algorithms-1920x1080.mp4" />

        </section>
    )
}