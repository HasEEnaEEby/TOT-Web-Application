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















// import { Check } from "lucide-react";
// import React from "react";

// export interface Column<T extends { _id: string; status: string }> {
//   key: keyof T | "actions";
//   label: string;
//   render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
// }

// interface DataTableProps<T extends { _id: string; status: string }> {
//   columns: Column<T>[];
//   data: T[];
//   onRowClick?: (row: T) => void;
//   selectedRows?: string[];
//   onSelectedRowsChange?: (selectedIds: string[]) => void;
//   onApproveRestaurant?: (id: string) => void;
//   onRejectRestaurant?: (id: string, reason?: string) => void;
// }

// export default function DataTable<T extends { _id: string; status: string }>({
//   columns,
//   data,
//   onRowClick,
//   selectedRows = [],
//   onSelectedRowsChange,
//   onApproveRestaurant,
//   onRejectRestaurant,
// }: DataTableProps<T>) {
//   const handleRowSelect = (e: React.MouseEvent, rowId: string) => {
//     e.stopPropagation();
//     if (!onSelectedRowsChange) return;

//     const newSelectedRows = selectedRows.includes(rowId)
//       ? selectedRows.filter((id) => id !== rowId)
//       : [...selectedRows, rowId];

//     onSelectedRowsChange(newSelectedRows);
//   };

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!onSelectedRowsChange) return;

//     const newSelectedRows = e.target.checked ? data.map((row) => row._id) : [];

//     onSelectedRowsChange(newSelectedRows);
//   };

//   const handleApprove = (e: React.MouseEvent, rowId: string) => {
//     e.stopPropagation();
//     if (onApproveRestaurant && rowId) {
//       onApproveRestaurant(rowId);
//     }
//   };

//   const handleReject = (
//     e: React.MouseEvent,
//     rowId: string,
//     reason?: string
//   ) => {
//     e.stopPropagation();
//     if (onRejectRestaurant && rowId) {
//       onRejectRestaurant(rowId, reason);
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse border border-gray-200">
//         <thead>
//           <tr className="bg-gray-50">
//             {onSelectedRowsChange && (
//               <th className="w-12 px-6 py-3 border-b">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300"
//                   checked={
//                     selectedRows.length === data.length && data.length > 0
//                   }
//                   onChange={handleSelectAll}
//                 />
//               </th>
//             )}
//             {columns.map((column) => (
//               <th
//                 key={String(column.key)}
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
//               >
//                 {column.label}
//               </th>
//             ))}
//             {onApproveRestaurant && onRejectRestaurant && (
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
//                 Actions
//               </th>
//             )}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((row) => (
//             <tr
//               key={row._id}
//               onClick={() => onRowClick?.(row)}
//               className={`${
//                 onRowClick ? "cursor-pointer" : ""
//               } hover:bg-gray-50 ${
//                 selectedRows.includes(row._id) ? "bg-gray-50" : ""
//               }`}
//             >
//               {onSelectedRowsChange && (
//                 <td className="w-12 px-6 py-4 whitespace-nowrap border-b">
//                   <div
//                     className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center cursor-pointer"
//                     onClick={(e) => handleRowSelect(e, row._id)}
//                   >
//                     {selectedRows.includes(row._id) && (
//                       <Check className="w-4 h-4 text-blue-600" />
//                     )}
//                   </div>
//                 </td>
//               )}
//               {columns.map((column) => (
//                 <td
//                   key={String(column.key)}
//                   className="px-6 py-4 whitespace-nowrap border-b"
//                 >
//                   {column.render
//                     ? column.render(row[column.key as keyof T], row)
//                     : String(row[column.key as keyof T] ?? "")}
//                 </td>
//               ))}
//               {onApproveRestaurant && onRejectRestaurant && (
//                 <td className="px-6 py-4 whitespace-nowrap border-b">
//                   <div className="flex gap-2">
//                     <button
//                       className={`px-3 py-1 rounded text-white ${
//                         row.status === "pending"
//                           ? "bg-green-500 hover:bg-green-600"
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                       onClick={(e) => handleApprove(e, row._id)}
//                       disabled={row.status !== "pending"}
//                     >
//                       {row.status === "approved" ? "Approved" : "Approve"}
//                     </button>
//                     <button
//                       className={`px-3 py-1 rounded text-white ${
//                         row.status === "pending"
//                           ? "bg-red-500 hover:bg-red-600"
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                       onClick={(e) => {
//                         if (row.status === "pending") {
//                           const reason = prompt(
//                             "Please enter a reason for rejecting the restaurant:"
//                           );
//                           if (reason !== null) {
//                             handleReject(e, row._id, reason);
//                           }
//                         }
//                       }}
//                       disabled={row.status !== "pending"}
//                     >
//                       {row.status === "rejected" ? "Rejected" : "Reject"}
//                     </button>
//                   </div>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
