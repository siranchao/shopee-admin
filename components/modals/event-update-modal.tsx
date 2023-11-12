'use client'
import * as z from "zod"
import { useState, useEffect, useContext } from "react"
import Modal from "./Modal"
import { Button } from "../ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EventListContext } from "@/app/(dashboard)/[storeId]/(routes)/(dashboard)/components/calendar/Calendar"
import { EventColumn } from "@/app/(dashboard)/[storeId]/(routes)/(dashboard)/components/calendar/eventTable/Columns"

interface EventUpdateModalProps {
    isOpen: boolean
    storeId: string
    event: EventColumn
    onClose: () => void
}

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    priority: z.string()
})

type FormValues = z.infer<typeof formSchema>

const PRIORITY = [
    {name: "Normal", value: '3'},
    {name: "Important", value: '2'},
    {name: "Urgent", value: '1'},
]

export default function EventUpdateModal({ isOpen, storeId, event, onClose }: EventUpdateModalProps) {
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { setEvents } = useContext(EventListContext)


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: event.name,
            description: event.desc,
            priority: PRIORITY.find(item => item.name === event.priority)?.value
        }
    })

    const onSubmit = async(data: FormValues) => {
        try {
            setLoading(true)
            const res = await axios.patch(`/api/${storeId}/events/${event.id}`, {
                name: data.name,
                desc: data.description,
                priority: parseInt(data.priority),
            })

            if(res.status === 200) {
                toast.success("Event updated")
                setEvents(res.data)
            }
            exit()

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

    const exit = () => {
        form.reset()
        onClose()
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if(!mounted) {
        return null
    }

    return (
        <>
            <Modal
                title={`Update Event on ${event.date}`}
                desc=""
                isOpen={isOpen}
                onClose={exit}
            >
                <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                                <div className="flex flex-col gap-4">
                                    <FormField 
                                        disabled={event.finished}
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="event name" disabled={loading} required {...field}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        disabled={event.finished}
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <Select 
                                                    disabled={loading || event.finished} 
                                                    onValueChange={field.onChange} 
                                                    value={field.value} 
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                defaultValue={field.value} 
                                                                placeholder="Select priority"
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>    
                                                    <SelectContent>
                                                        {PRIORITY.map((item) => (
                                                            <SelectItem key={item.value} value={item.value}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        disabled={event.finished}
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        disabled={loading}
                                                        placeholder="optional"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                    <Button variant="default" disabled={loading || event.finished} className="w-1/4">
                                        Update
                                    </Button>
                                </div>
                            </form>
                        </Form>
                </div>

            </Modal>
        </>
    )
}