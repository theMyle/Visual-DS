import Link from "next/link";

const accentColor = "#5A6FD6"; // Darker version of #94A6FF
const buttonColor = "#6f83e8";
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

      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
        {description}
      </p>

      <Link
        href={path}
        className="mt-3 block bg-[#6F83E8] rounded-xl w-full py-3 text-center text-white font-semibold shadow-[0_4px_0_#C0CBFF]
             transition-all duration-150 ease-in-out active:translate-y-[4px] active:shadow-none"
      >
        Explore {title}
      </Link>
    </div>
  );
}
