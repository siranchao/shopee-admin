'use client'
import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

import Modal from "../custom/Modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
    name: z.string().min(1)
})


export default function StoreModal() {
    const storeModal = useStoreModal()
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)

            const res = await axios.post('/api/stores', values)

            if(res){
                toast.success("Store created")
            }
        } catch(error) {
            toast.error("Somthing went wrong")
        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <Modal 
                title="Create Store" 
                desc="Add a new store to manage products and categories." 
                isOpen={storeModal.isOpen}
                onClose={storeModal.onClose}
            >
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="E-Commerce Store Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button 
                                    disabled={loading}
                                    variant="outline" 
                                    onClick={() => storeModal.onClose}
                                >
                                    Cancel
                                </Button>
                                
                                <Button 
                                    disabled={loading}
                                    type="submit"
                                >
                                    Continue
                                </Button>
                            </div>
                            
                        </form>
                    </Form>
                </div>
            </Modal>
        </>
    )
}