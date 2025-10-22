import { ACCENT_COLOR } from "@/app/lib/constants";

type HeadingTone = "accent" | "neutral";
type HeadingSize = "sm" | "md" | "lg";

export default function Heading({
  children,
  as = "h1",
  tone = "accent",
  size = "lg",
  className = "",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  tone?: HeadingTone; // accent = colored text + accent border, neutral = slate text + accent border
  size?: HeadingSize; // controls font size scale
  className?: string;
}) {
  const Tag = as;
  const sizeClasses =
    size === "sm"
      ? "text-xl md:text-2xl"
      : size === "md"
        ? "text-2xl md:text-[26px]"
        : "text-2xl md:text-2xl lg:text-3xl"; // lg (default)

  const base = `${sizeClasses} font-bold tracking-wide border-l-4 pl-3 mb-2 ${tone === "neutral" ? "text-slate-900" : ""
    } ${className}`;

  const style: React.CSSProperties = {
    borderColor: ACCENT_COLOR,
    ...(tone === "accent" ? { color: ACCENT_COLOR } : {}),
  };

  return (
    <Tag className={base} style={style}>
      {children}
    </Tag>
  );
}
