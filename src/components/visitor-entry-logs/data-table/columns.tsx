"use client";
import { DataTableColumnHeader } from "~/components/entry-logs/data-table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface EntryLog {
  id: number;
  vehicleColor: string;
  vehicleType: string;
  plateNumber: string;
  timestamp: Date;
}

export const columns: ColumnDef<EntryLog>[] = [
  {
    id: "id",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "vehicleColor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle Color" />
    ),
  },
  {
    accessorKey: "vehicleType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle Type" />
    ),
  },
  {
    accessorKey: "plateNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate Number" />
    ),
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => {
      const value = row.original.timestamp;
      if (!value) return null;

      return format(value, "MMMM dd, yyyy hh:mm a");
    },
  },
];
