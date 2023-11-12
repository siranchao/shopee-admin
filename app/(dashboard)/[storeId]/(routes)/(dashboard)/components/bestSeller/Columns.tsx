"use client"
import { CellAction } from "./CellAction"
import { ColumnDef } from "@tanstack/react-table"

export type ProductColumn = {
  id: string
  rank: number
  name: string
  category: string
  price: string
  sales: number
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sales",
    header: "Sold",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction data={row.original}/>
    )
  }
]
