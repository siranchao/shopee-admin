
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import SizeClient from "./components/Client"
import { SizeColumn } from "./components/columns"


export default async function SizesPage({ params }: { params: { storeId: string } }) {

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            name: "asc"
        }
    })

    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        updatedAt: format(item.updatedAt, "MMM dd, yyyy")
    }))


    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SizeClient data={formattedSizes} />
                </div>
            </div>
        </>
    )
}