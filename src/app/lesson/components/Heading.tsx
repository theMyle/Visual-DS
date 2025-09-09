import { ACCENT_COLOR } from "@/app/lib/constants";

export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="text-2xl md:text-2xl lg:text-3xl font-bold tracking-wide border-l-4 pl-3 mb-2"
      style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
    >
      {children}
    </h1>
  );
}
