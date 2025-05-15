"use client";
import React from "react";

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: string;
  id?: string;
  cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyState,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if data is an array
  const isDataArray = Array.isArray(data);

  if (!isDataArray || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyState || (
          <>
            <i className="bi bi-inbox text-4xl"></i>
            <p className="mt-2">Không tìm thấy dữ liệu nào</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-[1px]">
      <table className="w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns?.map((column, index) => (
              <th
                key={column.id || column.accessorKey || index}
                className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={column.id || column.accessorKey || colIndex}
                  className="whitespace-nowrap px-4 py-3"
                >
                  {column.cell
                    ? column.cell({ row: { original: row } })
                    : column.accessorKey
                    ? (row as any)[column.accessorKey]
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
