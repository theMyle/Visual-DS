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
        const response = await fetch(apiUrl, { next: { revalidate: 60 } });
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
        <div className="bg-white text-gray-800 font-sans">
            <main className="flex flex-col gap-8 px-4 pt-6 text-base md:text-lg max-w-3xl mx-auto pb-10">
                <BackButton text={`Back to ${slug}`} href={`/lesson/${slug}`} />
                
                <LessonRenderer content={content} />
                
                <MarkAsDone categorySlug={slug} href={currentHref} />
            </main>
            
            <BottomNav
                prev={prevNav}
                next={nextNav}
            />
        </div>
    );
}
