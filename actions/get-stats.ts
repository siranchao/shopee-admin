import prismadb from "@/lib/prismadb";

export const getStats = async (storeId: string) => {

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

    let totalRevenue: number = 0;
    for(const order of paidOrders){
        const val = order.orderItems.reduce((total, item) => Number(item.product?.price) * item.qty + total, 0)
        totalRevenue += val;
    }

    const aov = totalRevenue / paidOrders.length

    let salesCount = 0
    const today = new Date().getTime()
    paidOrders.forEach(order => {
        if((today - order.createdAt.getTime()) / (24 * 60 * 60 * 1000) < 30){
            salesCount++;
        }
    })



    return { totalRevenue, salesCount, aov }
}