import { codeToHtml } from "shiki";
import CodeBlockCopyButton from "./CodeBlockCopyButton";

interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
}

export default async function CodeBlock({
    code,
    language = "javascript",
    title,
}: CodeBlockProps) {
    const html = await codeToHtml(code, {
        lang: language,
        theme: "github-light",
    });

    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-sm font-medium text-slate-700">{title ?? language}</p>
                <CodeBlockCopyButton code={code} />
            </div>

            <div
                className="[&_.shiki]:m-0 [&_.shiki]:overflow-x-auto [&_.shiki]:p-4 [&_.shiki]:text-sm [&_.shiki]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
