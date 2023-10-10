'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Billboard } from "@prisma/client"
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
    label: z.string().min(1),
    desc: z.string(),
    imageUrl: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface FormProps {
    initData: Billboard | null
}

export default function BillboardForm({ initData }: FormProps) {
    const params = useParams()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || {
            label: "",
            desc: "",
            imageUrl: ""
        }
    })

    //form fields
    const title = initData ? "Edit Billboard" : "Create Billboard";
    const desc = initData ? "Edit a billboard" : "Add a new billboard";
    const toastMsg = initData ? "Billboard updated" : "Billboard created";
    const btnAction = initData ? "Save Changes" : "Create";


    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async(data: FormValues) => {
        try {
            setLoading(true)
            if(initData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMsg)

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

    const onDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard deleted")
        } catch(error: any) {
            if(error.response?.status === 403) {
                toast.error("You do not have permission")
            } 
            else {
                toast.error("Error, please remove all categories using this billboard")
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
                    <FormField 
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImgUploader
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />       
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  
                    
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Billboard Label" disabled={loading} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrption</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Billboard Description" disabled={loading} {...field}/>
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