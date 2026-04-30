import React from "react";

export default function TableSection({
  title,
  headers,
  rows,
}: {
  title?: string;
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="mb-10">
      {title && (
        <p className="leading-relaxed mb-2 font-medium">{title}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-blue-200">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-50">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 text-left font-semibold border-b-2 border-blue-200 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="odd:bg-white even:bg-blue-50/30">
                {row.map((cell, cellIdx) => {
                  const isLastRow = rowIdx === rows.length - 1;
                  const tdClass = isLastRow
                    ? "px-4 py-2 whitespace-nowrap"
                    : "px-4 py-2 border-b border-blue-100 whitespace-nowrap";
                  return (
                    <td key={cellIdx} className={tdClass}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
