"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./CellAction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  color: string
  category: string
  isFeatured: string
  isArchived: string
  updatedAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div className="h-6 w-6 rounded-full border mr-2" style={{ backgroundColor: row.original.color }} />
        {row.original.color}
      </div>
    )
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
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
