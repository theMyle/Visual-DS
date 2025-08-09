import Link from "next/link";

const accentColor = "#5A6FD6"; // Darker version of #94A6FF
const buttonColor = "#6F83E8";
const buttonShadow = "#C0CBFF";

type HomeItemProps = {
  title: string;
  description: string;
  path: string;
}

export default function HomeItem({ title, description, path }: HomeItemProps) {
  return (
    <div
      className="flex flex-col gap-3 w-full rounded-2xl px-6 py-5 shadow-md bg-white"
      style={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}
    >
      <h1
        className="font-bold text-2xl leading-snug"
        style={{ color: accentColor }}
      >
        {title}
      </h1>

      <p className="text-gray-600 text-lg leading-relaxed">
        {description}
      </p>

      <Link
        href={path}
        className="mt-3 block rounded-xl w-full py-3 text-center text-white font-semibold
             transition-all duration-150 ease-in-out active:translate-y-[4px] active:shadow-none"
        style={{
          backgroundColor: buttonColor,
          boxShadow: `0 4px 0 ${buttonShadow}` // hard edge shadow
        }}
      >
        Explore {title}
      </Link>
    </div>
  );
}
