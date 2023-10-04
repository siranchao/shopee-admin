"use client"
import { SizeColumn, columns } from "./columns"

import Heading from "@/components/customs/Heading"
import ApiList from "@/components/customs/ApiList"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/customs/DataTable"

import { useRouter, useParams } from "next/navigation"

interface SizeClientProps {
    data: SizeColumn[]
}

export default function SizeClient({ data }: SizeClientProps) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${data.length})`}
                    desc="Manage sizes for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />

            <DataTable columns={columns} data={data} searchValue="category"/>

            <Heading title="API" desc="API calls for Sizes"/>
            <Separator />
            <ApiList entityName="sizes" entityId="sizeId"/>
        </>
    )
}