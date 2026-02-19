import BackButton from "@/app/components/BackButton";
import SubLessonHeader from "@/app/components/SubLessonHeader";
import SubLessonItem from "@/app/components/SubLessonItem";

export default function LessonDetail() {
    const basehref = "/lesson/sample-lesson";

    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col  gap-6 max-w-3xl p-6">

                {/* back button */}
                <BackButton text="Back to Lessons" href="/lesson" />

                {/* header card */}
                <SubLessonHeader />

                {/* sub lessons */}
                <div className="flex flex-col gap-4">
                    <SubLessonItem
                        title="lesson 1.1"
                        href={`${basehref}/lesson-1-1`}
                    />
                    <SubLessonItem
                        title="lesson 1.2"
                        href={`${basehref}/lesson-1-2`}
                    />
                    <SubLessonItem
                        title="lesson 1.3"
                        href={`${basehref}/lesson-1-3`}
                    />
                    <SubLessonItem
                        title="lesson 1.4"
                        href={`${basehref}/lesson-1-4`}
                    />
                    <SubLessonItem
                        title="lesson 1.5"
                        href={`${basehref}/lesson-1-5`}
                    />
                </div>
            </div>
        </div>
    );
}