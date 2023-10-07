import prismadb from "@/lib/prismadb"
import ProductForm from "./components/ProductForm"


export default async function ProductDetail({ params }: { params: { storeId: string, productId: string } }) {
    const productPromise = prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true
        }
    })

    const categoriesPromise = prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colorsPromise = prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const [product, categories, colors] = await Promise.all([
        productPromise,
        categoriesPromise,
        colorsPromise
    ])

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ProductForm 
                        initData={product}
                        categories={categories}
                        colors={colors}
                    />
                </div>
            </div>
        </>
    )
}