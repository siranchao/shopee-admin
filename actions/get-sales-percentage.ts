import prismadb from "@/lib/prismadb";

interface GraphData {
    category: string
    sales: number
}

export const getSalesPercentage = async (storeId: string) => {
    
    const categories = await prismadb.category.findMany({
        where: {
            storeId,
        },
        select: {
            name: true
        }
    })

    const salesItems = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: {
                        select: {
                            price: true,
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
  
    const data: GraphData[] = []

    for(const category of categories) {
        let categorySales = 0
        const row: GraphData = {
            category: category.name,
            sales: categorySales
        }

        for(const order of salesItems) {
            for(const item of order.orderItems) {
                if(item.product.category.name === category.name) {
                    categorySales += Number(item.product?.price) * item.qty
                }
            }
        }
        row.sales = categorySales
        data.push(row)
    }

    return data
}