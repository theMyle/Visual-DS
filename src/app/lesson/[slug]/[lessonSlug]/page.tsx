import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import BottomNav from "../../components/BottomNav";
import MarkAsDone from "../../components/MarkAsDone";
import LessonRenderer from "../../components/LessonRenderer";
import { LESSON_MAP } from "@/app/lib/lessons";

interface PageProps {
    params: Promise<{
        slug: string;
        lessonSlug: string;
    }>;
}

export default async function LessonPage({ params }: PageProps) {
    const { slug, lessonSlug } = await params;

    // 1. Load the markdown content from Database via API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${slug}/${lessonSlug}`;
    let content = "";
    try {
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (!response.ok) {
            console.error(`Failed to fetch lesson from DB: ${response.status} ${response.statusText}`);
            // Fallback to local file if DB fetch fails (during migration)
            const contentDir = path.join(process.cwd(), "src/content/lessons", slug);
            const filePath = path.join(contentDir, `${lessonSlug}.md`);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                const parsed = matter(fileContent);
                content = parsed.content;
            } else {
                notFound();
            }
        } else {
            const lesson = await response.json();
            content = lesson.content;
        }
    } catch (err) {
        console.error("API Fetch Error:", err);
        // Fallback
        const contentDir = path.join(process.cwd(), "src/content/lessons", slug);
        const filePath = path.join(contentDir, `${lessonSlug}.md`);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const parsed = matter(fileContent);
            content = parsed.content;
        } else {
            notFound();
        }
    }

    // 2. Find prev/next lessons for BottomNav
    const categoryData = LESSON_MAP[slug];
    if (!categoryData) notFound();

    const currentHref = `/lesson/${slug}/${lessonSlug}`;
    const lessonIndex = categoryData.lessons.findIndex(l => l.href === currentHref);

    const prevLesson = lessonIndex > 0 ? categoryData.lessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < categoryData.lessons.length - 1 ? categoryData.lessons[lessonIndex + 1] : null;

    // Standard fallback for next if it's the last lesson
    const nextNav = nextLesson
        ? { href: nextLesson.href, label: nextLesson.title.split("- ")[1] || nextLesson.title }
        : { href: "/lesson", label: "Lesson Page" };

    const prevNav = prevLesson
        ? { href: prevLesson.href, label: prevLesson.title.split("- ")[1] || prevLesson.title }
        : undefined;

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-800 font-sans selection:bg-purple-100">
            <main className="flex flex-col gap-8 px-6 pt-8 text-base md:text-lg max-w-3xl mx-auto pb-12">
                <div className="opacity-80 hover:opacity-100 transition-opacity">
                    <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                </div>

                <article className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                    <LessonRenderer content={content} />
                </article>

                <div className="pt-4 border-t border-gray-100">
                    <MarkAsDone categorySlug={slug} href={currentHref} />
                </div>
            </main>

            <div className="bg-white border-t border-gray-100">
                <BottomNav
                    prev={prevNav}
                    next={nextNav}
                />
            </div>
        </div>
    );
}
