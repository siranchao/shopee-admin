"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./CellAction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string
  displayOrder: number
  updatedAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "displayOrder",
    header: "Display Order",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel
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
