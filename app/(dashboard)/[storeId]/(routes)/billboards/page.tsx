import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import BillBoardClient from "./components/Client"
import { BillboardColumn } from "./components/columns"

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Billboards',
    description: 'Shopee Admin - Mangage Billboards',
}


export default async function BillboardsPage({ params }: { params: { storeId: string } }) {

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            label: "asc"
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
        desc: billboard.desc,
        updatedAt: format(billboard.updatedAt, "MMM dd, yyyy")
    }))

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <BillBoardClient data={formattedBillboards} />
                </div>
            </div>
        </>
    )
}