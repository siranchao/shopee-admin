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

    const sizesPromise = prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colorsPromise = prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const [product, categories, sizes, colors] = await Promise.all([
        productPromise,
        categoriesPromise,
        sizesPromise,
        colorsPromise
    ])

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ProductForm 
                        initData={product}
                        categories={categories}
                        sizes={sizes}
                        colors={colors}
                    />
                </div>
            </div>
        </>
    )
}