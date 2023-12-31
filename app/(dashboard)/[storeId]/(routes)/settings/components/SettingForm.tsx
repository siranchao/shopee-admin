'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Store } from "@prisma/client"
import { useState } from "react"
import axios from "axios"
import { useOrigin } from "@/hooks/use-origin"

import Heading from "@/components/customs/Heading"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/modals/alert-modal"
import ApiAlert from "@/components/customs/ApiAlert"

interface FormProps {
    initData: Store
}

const formSchema = z.object({
    name: z.string().min(1),
})

type FormValues = z.infer<typeof formSchema>


export default function SettingForm({ initData }: FormProps) {
    const params = useParams()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData
    })

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async(data: FormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated")
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
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push("/")
            toast.success("Store deleted")
        } catch(error: any) {
            if(error.response?.status === 403) {
                toast.error("You do not have permission")
            } 
            else {
                toast.error("Error, make sure to remove all products and categories first")
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
                    title="Settings"
                    desc="Manage your store preferences"
                />
                <Button
                    disabled={loading} 
                    variant="destructive"
                    size="sm"
                    onClick={() => {setOpen(true)}}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
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
                                        <Input placeholder="Store Name" disabled={loading} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" desc={`${useOrigin()}/api/${params.storeId}`} variant="public"/>
        </>
    )
}