
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import { formatter } from "@/lib/utils"

import ProductClient from "./components/Client"
import { ProductColumn } from "./components/columns"


export default async function ProductsPage({ params }: { params: { storeId: string } }) {

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured ? "Yes" : "No",
        isArchived: item.isArchived ? "Yes" : "No",
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.value,
        color: item.color.value,
        updatedAt: format(item.updatedAt, "MMM dd, yyyy")
    }))

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ProductClient data={formattedProducts} />
                </div>
            </div>
        </>
    )
}