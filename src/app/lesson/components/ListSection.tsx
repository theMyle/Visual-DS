
export default function ListSection({
  title,
  ordered = false,
  children,
}: {
  title?: string;
  ordered?: boolean;
  children: React.ReactNode;
}) {
  const ListTag = ordered ? "ol" : "ul";
  const listStyleClass = ordered ? "list-decimal" : "list-disc";

  return (
    <div className="mb-4 md:mb-6">
      {title && (
        <p className="mb-2 text-base md:text-lg font-semibold text-slate-900 leading-snug">{title}</p>
      )}
      <ListTag className={`${listStyleClass} pl-6 md:pl-7 space-y-2 marker:text-slate-400 text-slate-800 leading-[1.7]`}>
        {children}
      </ListTag>
    </div>
  );
}
