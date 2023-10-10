'use client'

import { OrderColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import OrderModal from "@/components/modals/order-modal"
  

interface CellActionProps {
    data: OrderColumn
}

export function CellAction({ data }: CellActionProps) {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <OrderModal
                isOpen={open}
                orderItems={data.orderItems}
                onClose={() => setOpen(false)}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"  onClick={() => setOpen(true)} />
                    </Button>
                </DropdownMenuTrigger>
            </DropdownMenu>
        </>
    )
}