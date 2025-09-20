import Link from "next/link";

const accentColor = "#5A6FD6"; // Darker version of #94A6FF
const buttonColor = "#6f83e8";
const buttonShadow = "#C0CBFF";

// Subtle gradient borders for each card type
const cardStyles = {
  "Lessons": {
    border: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    shadow: "0 4px 12px rgba(0,0,0,0.05), 0 0 20px rgba(99, 102, 241, 0.15)",
    glow: "0 0 30px rgba(99, 102, 241, 0.1)"
  },
  "Simulator": {
    border: "linear-gradient(135deg, #3b82f6, #6366f1)",
    shadow: "0 4px 12px rgba(0,0,0,0.05), 0 0 20px rgba(59, 130, 246, 0.15)",
    glow: "0 0 30px rgba(59, 130, 246, 0.1)"
  },
  "Assessment": {
    border: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    shadow: "0 4px 12px rgba(0,0,0,0.05), 0 0 20px rgba(139, 92, 246, 0.15)",
    glow: "0 0 30px rgba(139, 92, 246, 0.1)"
  }
};

type HomeItemProps = {
  title: string;
  description: string;
  path: string;
}

export default function HomeItem({ title, description, path }: HomeItemProps) {
  const style = cardStyles[title as keyof typeof cardStyles];
  
  return (
    <div
      className="flex flex-col gap-3 lg:gap-6 w-full h-full rounded-2xl px-6 py-5 lg:px-8 lg:py-8 shadow-md bg-white relative overflow-hidden"
      style={{
        boxShadow: style?.shadow || "0 4px 12px rgba(0,0,0,0.05)"
      }}
    >
      {/* Gradient border with glow */}
      <div 
        className="absolute inset-0 rounded-2xl p-[2px] -z-10"
        style={{
          background: style?.border || "linear-gradient(135deg, #e5e7eb, #d1d5db)",
          filter: `drop-shadow(${style?.glow || "0 0 30px rgba(0,0,0,0.05)"})`
        }}
      >
        <div className="w-full h-full bg-white rounded-2xl" />
      </div>
      
      <h1
        className="font-bold text-2xl lg:text-3xl leading-snug relative z-10"
        style={{ color: accentColor }}
      >
        {title}
      </h1>

      <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed flex-grow relative z-10">
        {description}
      </p>

      <Link
        href={path}
        className="mt-3 lg:mt-4 block bg-[#6F83E8] rounded-xl w-full py-3 lg:py-4 text-center text-white font-semibold shadow-[0_4px_0_#C0CBFF]
             transition-all duration-150 ease-in-out hover:bg-[#5A6FD6] active:translate-y-[4px] active:shadow-none relative z-10 lg:text-lg"
      >
        Explore {title}
      </Link>
    </div>
  );
}
