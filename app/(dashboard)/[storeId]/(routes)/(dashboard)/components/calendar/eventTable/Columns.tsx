"use client"
import { CellAction } from "./CellAction"
import { ColumnDef } from "@tanstack/react-table"

export type EventColumn = {
  id: string
  name: string
  date: string
  desc: string
  priority: string
  finished: boolean
}

export const columns: ColumnDef<EventColumn>[] = [
  {
    accessorKey: "name",
    header: "Event",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction data={row.original}/>
    )
  }
]
