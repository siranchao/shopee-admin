'use client'

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        //to-do
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
                                                placeholder="E-Commerce Store Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button variant="outline" onClick={() => storeModal.onClose}>Cancel</Button>
                                <Button type="submit">Continue</Button>
                            </div>
                            
                        </form>
                    </Form>
                </div>
            </Modal>
        </>
    )
}