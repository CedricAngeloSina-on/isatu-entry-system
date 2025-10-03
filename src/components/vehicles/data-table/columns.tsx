"use client";
import { DataTableColumnHeader } from "~/components/entry-logs/data-table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";

export interface Vehicle {
  id: number;
  vehicleColor: string;
  vehicleType: string;
  plateNumber: string;
}

export const columns: ColumnDef<Vehicle>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
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
];
