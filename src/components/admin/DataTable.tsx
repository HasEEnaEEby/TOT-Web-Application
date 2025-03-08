import React, { Dispatch, SetStateAction } from 'react';

export type Column<T> = {
  key: keyof T | 'actions';
  label: string;
  render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
};

export type DataTableProps<T extends { id: string }> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectedRows?: string[];
  onSelectedRowsChange?: Dispatch<SetStateAction<string[]>>;
};

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  selectedRows = [],
  onSelectedRowsChange,
}: DataTableProps<T>) {
  const handleRowSelect = (rowId: string) => {
    if (!onSelectedRowsChange) return;

    const newSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];

    onSelectedRowsChange(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (!onSelectedRowsChange) return;

    const newSelectedRows = selectedRows.length === data.length 
      ? [] 
      : data.map((row) => row.id);

    onSelectedRowsChange(newSelectedRows);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {onSelectedRowsChange && (
              <th className="w-12 px-6 py-3 border-b">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`${
                onRowClick ? "cursor-pointer" : ""
              } hover:bg-gray-50 ${
                selectedRows.includes(row.id) ? "bg-gray-50" : ""
              }`}
            >
              {onSelectedRowsChange && (
                <td className="w-12 px-6 py-4 whitespace-nowrap border-b">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap border-b"
                >
                  {column.render
                    ? column.render(row[column.key as keyof T], row)
                    : String(row[column.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}











