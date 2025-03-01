"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EMode, useAppStore } from "@/store/app";
import { IData } from "@/types/app";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

const columns: ColumnDef<IData>[] = [
  {
    accessorKey: "name",
    header: "Country",
  },
  {
    id: "details",
    accessorKey: "details",
    cell: ({ row }) => row.getValue<IData["details"]>("details").study,
    header: "Study",
  },
  {
    id: "details1",
    accessorKey: "details",
    cell: ({ row }) => row.getValue<IData["details"]>("details").city,
    header: "City or state",
  },
  {
    id: "details2",
    accessorKey: "details",
    cell: ({ row }) => row.getValue<IData["details"]>("details").population,
    header: "Overall age",
  },
  {
    id: "details3",
    accessorKey: "details",
    cell: ({ row }) => row.getValue<IData["details"]>("details").healthStatus,
    header: "Health status",
  },
  {
    id: "details4",
    accessorKey: "details",
    cell: ({ row }) => row.getValue<IData["details"]>("details").setting,
    header: "Setting",
  },
  {
    id: "details5",
    accessorKey: "details",
    cell: ({ row }) =>
      `${row.getValue<IData["details"]>("details").subFilterKey} : ${
        row.getValue<IData["details"]>("details").subFilterValue
      }`,
    header: "Filter",
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          uptake
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `${row.getValue("value")}%`,
  },
];

interface IProps {
  mapData: IData[];
}

const DataTable = ({ mapData }: IProps) => {
  const shouldRender = useAppStore(
    (s) => s.mode === EMode.TABLE || s.mode === EMode.BOTH
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: mapData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    state: {
      sorting,
    },
  });

  if (!shouldRender) return null;

  return (
    <div className="h-full grow shrink basis-0 p-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
