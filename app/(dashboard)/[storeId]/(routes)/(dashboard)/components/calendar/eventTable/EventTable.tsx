"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: any
}

function EventTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
    const [page, setPage] = useState(0)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
            pagination: {
                pageIndex: page,
                pageSize: 5
            }
        }
    })

    return (
        <>
            <div>
                <Table className="overflow-x-scroll">
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
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const finished = data[row.index].finished
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={`${row.getValue("priority") === "Urgent" && "text-red-600"} ${finished && "line-through"}`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                        ))}
                                    </TableRow>)
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No events.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            { data.length > 5 && (
                <div className="flex items-center justify-end space-x-2 py-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(prev => prev - 1)}
                        disabled={page === 0}
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page === Math.ceil(data.length/5) - 1}
                    >
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
                )
            }

        </>
    )
}

export default EventTable