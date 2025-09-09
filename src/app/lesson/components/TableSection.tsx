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
        <div className="mb-4">
            {title && (
                <p className="leading-relaxed mb-2 font-medium">{title}</p>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-blue-50 py-4 rounded-xl">
                    <thead>
                        <tr>
                            {headers.map((header, idx) => (
                                <th key={idx} className="px-4 py-2 text-left font-semibold border-b-2 border-blue-200">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => {
                                    // Remove border for last row
                                    const isLastRow = rowIdx === rows.length - 1;
                                    const tdClass = isLastRow
                                        ? "px-4 py-2"
                                        : "px-4 py-2 border-b border-blue-100";
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
