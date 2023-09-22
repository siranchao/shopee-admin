
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import BillBoardClient from "./components/Client"
import { BillboardColumn } from "./components/columns"


export default async function BillboardsPage({ params }: { params: { storeId: string } }) {

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
        createdAt: format(billboard.createdAt, "MMMM dd, yyyy")
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