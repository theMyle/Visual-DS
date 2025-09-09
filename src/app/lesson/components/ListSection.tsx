
export default function ListSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      {title && (
        <p className="leading-relaxed mb-2 font-medium">{title}</p>
      )}
      <ul className="list-disc pl-8 bg-blue-50 py-4 rounded-xl">
        {children}
      </ul>
    </div>
  );
}
