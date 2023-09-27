"use client"
import { OrderColumn, columns } from "./columns"

import Heading from "@/components/customs/Heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/customs/DataTable"

interface OrderClientProps {
    data: OrderColumn[]
}

export default function OrderClient({ data }: OrderClientProps) {
    return (
        <>
            <Heading
                title={`Orders (${data.length})`}
                desc="Manage orders for your store"
            />
        
            <Separator />

            <DataTable columns={columns} data={data} searchValue="products"/>
        </>
    )
}