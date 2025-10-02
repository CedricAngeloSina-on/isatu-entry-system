"use client";
import { DataTableColumnHeader } from "~/components/entry-logs/data-table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface EntryLog {
  id: number;
  name: string;
  idNumber: string;
  college: string;
  plateNumber: string;
  vehicleType: string;
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
    accessorKey: "idNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Number" />
    ),
  },
  {
    accessorKey: "college",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="College" />
    ),
  },
  {
    accessorKey: "plateNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate Number" />
    ),
  },
  {
    accessorKey: "vehicleType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle Type" />
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
