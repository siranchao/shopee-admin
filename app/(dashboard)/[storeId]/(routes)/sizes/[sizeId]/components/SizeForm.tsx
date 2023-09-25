'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Size } from "@prisma/client"
import { useState } from "react"
import axios from "axios"

import Heading from "@/components/customs/Heading"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/modals/alert-modal"
import ImgUploader from "@/components/customs/ImgUploader"


const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface FormProps {
    initData: Size | null
}

export default function SizeForm({ initData }: FormProps) {
    const params = useParams()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || {
            name: "",
            value: ""
        }
    })

    //form fields
    const title = initData ? "Edit Size" : "Create Size";
    const desc = initData ? "Edit a size" : "Add a new size";
    const toastMsg = initData ? "Size updated" : "Size created";
    const btnAction = initData ? "Save Changes" : "Create";


    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async(data: FormValues) => {
        try {
            data.value = data.value.toUpperCase()
            setLoading(true)
            if(initData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMsg)

        } catch(error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success("Size deleted")
        } catch(error) {
            toast.error("Error, please remove all products using this size")
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
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    desc={desc}
                />
                { initData && (
                    <Button
                        disabled={loading} 
                        variant="destructive"
                        size="sm"
                        onClick={() => {setOpen(true)}}
                    >
                        <Trash className="h-4 w-4"/>
                    </Button>
                )}

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Size Name" disabled={loading} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Size Value" disabled={loading} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">
                        {btnAction}
                    </Button>
                </form>
            </Form>

        </>
    )
}