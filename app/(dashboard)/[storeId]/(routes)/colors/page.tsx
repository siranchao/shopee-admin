import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import ColorClient from "./components/Client"
import { ColorColumn } from "./components/columns"

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Colors',
    description: 'Shopee Admin - Mangage Colors',
}


export default async function ColorsPage({ params }: { params: { storeId: string } }) {

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            updatedAt: "desc"
        }
    })

    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        updatedAt: format(item.updatedAt, "MMM dd, yyyy")
    }))


    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ColorClient data={formattedColors} />
                </div>
            </div>
        </>
    )
}