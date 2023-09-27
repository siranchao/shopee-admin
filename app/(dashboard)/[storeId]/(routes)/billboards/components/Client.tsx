"use client"
import { BillboardColumn, columns } from "./columns"

import Heading from "@/components/customs/Heading"
import ApiList from "@/components/customs/ApiList"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/customs/DataTable"

import { useRouter, useParams } from "next/navigation"

interface BillBoardClientProps {
    data: BillboardColumn[]
}

export default function BillBoardClient({ data }: BillBoardClientProps) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    desc="Manage billboards for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />

            <DataTable columns={columns} data={data} searchValue="label"/>

            <Heading title="API" desc="API calls for Billboards"/>
            <Separator />
            <ApiList entityName="billboards" entityId="billboardId"/>
        </>
    )
}