import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {

    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    })

    let total: number = 0;
    for(const order of paidOrders){
        const val = order.orderItems.reduce((total, item) => Number(item.product?.price) * item.qty + total, 0)
        total += val;
    }

    return total
}