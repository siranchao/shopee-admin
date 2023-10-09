"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./CellAction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string
  label: string
  desc: string
  updatedAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "desc",
    header: "Description",
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
