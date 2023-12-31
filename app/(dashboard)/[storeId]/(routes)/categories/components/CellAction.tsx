'use client'

import { CategoryColumn } from "./columns"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import axios from "axios"

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
    data: CategoryColumn
}

export function CellAction({ data }: CellActionProps) {

    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const router = useRouter()
    const params = useParams()

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Category ID copied")
    }

    const onDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
            router.refresh()
            toast.success("Category deleted")
        } catch(error: any) {
            if(error.response?.status === 403) {
                toast.error("You do not have permission")
            } 
            else {
                toast.error("Error, please remove all products using this category")
            }
            
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
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
                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => {router.push(`/${params.storeId}/categories/${data.id}`)}}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>

                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}