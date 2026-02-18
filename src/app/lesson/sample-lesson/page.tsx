import SubLessonHeader from "@/app/components/SubLessonHeader";
import SubLessonItem from "@/app/components/SubLessonItem";

export default function LessonDetail() {
    return (
        <div className="flex w-full justify-center">
            <div className="flex flex-col gap-8 max-w-3xl p-6">
                {/* header */}
                <div>
                    <SubLessonHeader />
                </div>

                {/* sub lessons */}
                <div className="flex flex-col gap-4">
                    <SubLessonItem />
                    <SubLessonItem />
                    <SubLessonItem />
                </div>
            </div>
        </div>
    );
}