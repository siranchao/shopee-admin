import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import { CategoryColumn } from "./components/columns"
import CategoryClient from "./components/Client"

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Categories',
    description: 'Shopee Admin - Mangage Categories',
}


export default async function CategoriesPage({ params }: { params: { storeId: string } }) {

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            displayOrder: "asc"
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        displayOrder: item.displayOrder,
        updatedAt: format(item.updatedAt, "MMM dd, yyyy")
    }))

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <CategoryClient data={formattedCategories} />
                </div>
            </div>
        </>
    )
}