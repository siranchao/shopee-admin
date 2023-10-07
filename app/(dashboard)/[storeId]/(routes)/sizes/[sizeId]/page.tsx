import prismadb from "@/lib/prismadb"
import SizeForm from "./components/SizeForm"

export default async function SizeDetail({ params }: { params: { sizeId: string, storeId: string  } }) {
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    })

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SizeForm initData={size} categories={categories}/>
                </div>   
            </div>
        </>
    )
}