import { ACCENT_COLOR } from "@/app/lib/constants";

type Variant = 'accent' | 'info' | 'warning' | 'success';

const variantPalette: Record<Variant, { hex: string; text?: string; bg?: string; ring?: string }> = {
  accent: { hex: ACCENT_COLOR, text: 'text-indigo-800', bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
  info: { hex: '#38BDF8', text: 'text-sky-800', bg: 'bg-sky-50', ring: 'ring-sky-100' },
  warning: { hex: '#F59E0B', text: 'text-amber-900', bg: 'bg-amber-50', ring: 'ring-amber-100' },
  success: { hex: '#22C55E', text: 'text-green-800', bg: 'bg-green-50', ring: 'ring-green-100' },
};

export default function Highlight({
  children,
  variant = 'accent',
  appearance = 'pill',
  subtle = true,
  className = '',
}: {
  children: React.ReactNode;
  variant?: Variant;
  appearance?: 'underline' | 'pill';
  subtle?: boolean;
  className?: string;
}) {
  const v = variantPalette[variant];

  if (appearance === 'pill') {
    const ring = subtle && v.ring ? `ring-1 ring-inset ${v.ring}` : '';
    const bg = v.bg ?? 'bg-indigo-50';
    const text = v.text ?? 'text-indigo-800';
    return (
      <span className={`inline-flex items-baseline px-2 py-0.5 rounded-xl ${bg} ${text} ${ring} ${className}`}>
        {children}
      </span>
    );
  }

  // Default: minimal underline highlight using the variant color
  return (
    <span
      className={`underline decoration-2 underline-offset-[3px] ${className}`}
      style={{ textDecorationColor: v.hex }}
    >
      {children}
    </span>
  );
}
