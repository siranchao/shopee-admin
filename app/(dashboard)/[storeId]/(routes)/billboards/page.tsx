
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
            updatedAt: "desc"
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
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