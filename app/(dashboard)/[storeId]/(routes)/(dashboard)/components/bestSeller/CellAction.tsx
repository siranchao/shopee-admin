'use client'
import { ProductColumn } from "./Columns"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import AlertModal from "@/components/modals/alert-modal"
  

interface CellActionProps {
    data: ProductColumn
}

export function CellAction({ data }: CellActionProps) {
    const [open, setOpen] = useState<boolean>(false)

    const router = useRouter()
    const params = useParams()

    const onCopy = (name: string) => {
        navigator.clipboard.writeText(name)
        toast.success("Product name copied")
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => {router.push(`/${params.storeId}/products/${data.id}`)}}>
                        <Edit className="mr-2 h-4 w-4" />
                        View product
                    </DropdownMenuItem>

                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => onCopy(data.name)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy name
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}