"use client"
import { CategoryColumn, columns } from "./columns"

import Heading from "@/components/customs/Heading"
import ApiList from "@/components/customs/ApiList"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/customs/DataTable"

import { useRouter, useParams } from "next/navigation"

interface CategoryClientProps {
    data: CategoryColumn[]
}

export default function CategoryClient({ data }: CategoryClientProps) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${data.length})`}
                    desc="Manage categories for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />

            <DataTable columns={columns} data={data} searchValue="name"/>

            <Heading title="API" desc="API calls for Categories"/>
            <Separator />
            <ApiList entityName="categories" entityId="categoryId"/>
        </>
    )
}