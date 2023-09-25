"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./CellAction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string
  name: string
  value: string
  updatedAt: string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Hex Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div className="h-6 w-6 rounded-full border mr-2" style={{ backgroundColor: row.original.value }} />
        {row.original.value}
      </div>
    )
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction data={row.original}/>
    )
  }
]
