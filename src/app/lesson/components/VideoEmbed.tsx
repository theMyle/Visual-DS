import React from "react";

interface VideoEmbedProps {
    embedUrl: string;
    title?: string;
    className?: string;
}

// Supports YouTube, Vimeo, or direct video links
const isYouTube = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");
const isVimeo = (url: string) => url.includes("vimeo.com");
const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

export default function VideoEmbed({ embedUrl, title = "Video", className = "" }: VideoEmbedProps) {
    if (isYouTube(embedUrl)) {
        // Extract YouTube video ID
        return (
            <div className={`aspect-video w-full rounded-lg overflow-hidden shadow ${className}`}>
                <iframe
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
            </div>
        );
    }
    if (isVideoFile(embedUrl)) {
        return (
            <video controls className={`w-full rounded-lg shadow ${className}`}>
                <source src={embedUrl} />
                Your browser does not support the video tag.
            </video>
        );
    }
    // Fallback: just a link
    return <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{title}</a>;
}
