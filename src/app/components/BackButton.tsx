import Link from "next/link";

interface BackButtonProps {
    text: string;
    href: string;
}

export default function BackButton({ text, href }: BackButtonProps) {
    return (
        <div>
            <Link
                href={href}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                {text}
            </Link>
        </div>
    )
}