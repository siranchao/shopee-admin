import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils"

export const getSalesByProduct = async (storeId: string) => {
    
    const data = await prismadb.product.findMany({
        where: {
            storeId,
        },
        select: {
            id: true,
            name: true,
            price: true,
            category: {
                select: {
                    name: true
                }
            },
            orderItems: {
                select: {
                    id: true,
                    qty: true
                }
            }
        }
    })

    //convert data structure
    const formattedData = []
    for(const item of data) {
        if(item.orderItems.length > 0) {
            const product = {
                id: item.id,
                rank: 0,
                name: item.name,
                price: formatter.format(item.price.toNumber()),
                category: item.category.name,
                sales: item.orderItems.reduce((acc, item) => acc + item.qty, 0)
            }
            formattedData.push(product)
        }
    }

    //only return top 20
    const sortedData = formattedData.sort((a, b) => {
        return b.sales - a.sales
    }).slice(0, 20)

    //add rank
    for(let i = 0; i < sortedData.length; i++) {
        sortedData[i].rank = i + 1
    }


    return sortedData
}