'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Category, Billboard } from "@prisma/client"
import { useState } from "react"
import axios from "axios"

import Heading from "@/components/customs/Heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/modals/alert-modal"


const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
    displayOrder: z.coerce.number()
})

type FormValues = z.infer<typeof formSchema>

interface FormProps {
    initData: Category | null
    billboards: Billboard[]
}

export default function CategoryForm({ initData, billboards }: FormProps) {
    const params = useParams()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || {
            name: "",
            billboardId: "",
            displayOrder: 0
        }
    })

    //form fields
    const title = initData ? "Edit Category" : "Create Category";
    const desc = initData ? "Edit a category" : "Add a new category";
    const toastMsg = initData ? "Category updated" : "Category created";
    const btnAction = initData ? "Save Changes" : "Create";


    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async(data: FormValues) => {
        try {
            setLoading(true)
            if(initData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
                                        <Input placeholder="Category Name" disabled={loading} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value} 
                                                    placeholder="Select a billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>    
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="displayOrder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Order</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter order" type="number" disabled={loading} {...field}/>
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