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

interface EventModalProps {
    isOpen: boolean
    storeId: string
    date: Date | undefined
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

const isValidDate = (date: Date | undefined) => {
    if(!date) {
        return false
    }
    return date > new Date()
}

export default function EventModal({ isOpen, storeId, date, onClose }: EventModalProps) {
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { setEvents } = useContext(EventListContext)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            priority: "3"
        }
    })

    const onSubmit = async(data: FormValues) => {
        try {
            setLoading(true)
            const uploadData = {
                ...data,
                priority: parseInt(data.priority),
                date: date,
            }
            const res = await axios.post(`/api/${storeId}/events`, uploadData)
            if(res.status === 201) {
                toast.success("New event created")
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
                title="New Event"
                desc={isValidDate(date) ? `Create an event on: ${date?.toLocaleDateString()}` : `Please select a future date!`}
                isOpen={isOpen}
                onClose={exit}
            >
                <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                                <div className="flex flex-col gap-4">
                                    <FormField 
                                        disabled={!isValidDate(date)}
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
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <Select 
                                                    disabled={loading || !isValidDate(date)} 
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
                                        disabled={!isValidDate(date)}
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
                                    <Button variant="default" disabled={loading || !isValidDate(date)} className="w-1/4">
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </Form>
                </div>

            </Modal>
        </>
    )
}