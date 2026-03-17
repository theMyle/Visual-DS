import Image from "next/image";

interface VisualImageProps {
    src: string;
    alt: string;
    showAlt?: boolean;
}

export default function VisualImage({ src, alt, showAlt = false }: VisualImageProps) {
    return (
        <div className="flex flex-col justify-center items-center w-full pt-5 pb-5 gap-2">
            <Image
                src={src}
                alt={alt}
                width={800}
                height={100}
            />
            {showAlt && <p className="italic text-sm text-center">{alt}</p>}
        </div>
    );
}
