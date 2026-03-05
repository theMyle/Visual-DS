import Image from "next/image";

interface VisualImageProps {
    src: string;
    alt: string;
}

export default function VisualImage({ src, alt }: VisualImageProps) {
    return (
        <div className="flex flex-col justify-center items-center w-full pt-10 pb-10 gap-2">
            <Image
                src={src}
                alt={alt}
                width={800}
                height={100}
            />
            <p className="italic text-sm text-center">{alt}</p>
        </div>
    );
}
