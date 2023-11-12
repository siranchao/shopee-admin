'use client'
import { EventColumn } from "./Columns"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"
import { useState, useContext } from "react"
import { EventListContext } from "@/app/(dashboard)/[storeId]/(routes)/(dashboard)/components/calendar/Calendar"
import axios from "axios"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarCheck, Edit, MoreHorizontal, Trash } from "lucide-react"
import AlertModal from "@/components/modals/alert-modal"
import EventUpdateModal from "@/components/modals/event-update-modal"

  
interface CellActionProps {
    data: EventColumn
}

export function CellAction({ data }: CellActionProps) {
    const { setEvents } = useContext(EventListContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)

    const params = useParams()

    const onDelete = async() => {
        try {
            setLoading(true)
            const res = await axios.delete(`/api/${params.storeId}/events/${data.id}`)
            setEvents(res.data)
            toast.success("Event deleted")

        } catch(error: any) {
            if(error.response?.status === 403) {
                toast.error("You do not have permission")
            } 
            else {
                toast.error("Something went wrong")
            }
            
        } finally {
            setLoading(false)
            setOpenAlert(false)
        }
    }

    const onFinished = async() => {
        try {
            setLoading(true)
            const res = await axios.patch(`/api/${params.storeId}/events/${data.id}`, {
                finished: true
            })
            setEvents(res.data)
            toast.success("Event finished")

        } catch(error: any) {
            if(error.response?.status === 403) {
                toast.error("You do not have permission")
            } 
            else {
                toast.error("Something went wrong")
            }
            
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={openAlert}
                onClose={() => setOpenAlert(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <EventUpdateModal
                isOpen={openUpdate}
                storeId={params.storeId as string}
                event={data}
                onClose={() => setOpenUpdate(false)}
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

                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => setOpenUpdate(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update event
                    </DropdownMenuItem>

                    {!data.finished && (
                        <DropdownMenuItem className="my-1 hover:font-semibold" onClick={onFinished}>
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Mark as finished
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="my-1 hover:font-semibold" onClick={() => setOpenAlert(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}