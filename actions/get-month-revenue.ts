import prismadb from "@/lib/prismadb";


interface GraphData {
    name: string
    revenue: number
    order_count: number
}

export const getGraphRevenue = async (storeId: string) => {

    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    })

    const monthlyRevenue: {[key: number]: number} = {}
    const monthlyorder_count: {[key: number]: number} = {}

    for(const order of paidOrders) {
        const month = order.createdAt.getMonth()
        let revenueForOrder: number = 0

        for(const item of order.orderItems) {
            revenueForOrder += Number(item.product?.price) * item.qty
        }

        monthlyorder_count[month] = (monthlyorder_count[month] || 0) + 1
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
    }

    const graphData: GraphData[] = [
        { name: "Jan", revenue: 0, order_count: 0 },
        { name: "Feb", revenue: 0, order_count: 0 },
        { name: "Mar", revenue: 0, order_count: 0 },
        { name: "Apr", revenue: 0, order_count: 0 },
        { name: "May", revenue: 0, order_count: 0 },
        { name: "Jun", revenue: 0, order_count: 0 },
        { name: "Jul", revenue: 0, order_count: 0 },
        { name: "Aug", revenue: 0, order_count: 0 },
        { name: "Sep", revenue: 0, order_count: 0 },
        { name: "Oct", revenue: 0, order_count: 0 },
        { name: "Nov", revenue: 0, order_count: 0 },
        { name: "Dec", revenue: 0, order_count: 0 },
    ]

    for(const month in monthlyRevenue) {
        graphData[parseInt(month)].revenue = monthlyRevenue[parseInt(month)]
    }

    for(const month in monthlyorder_count) {
        graphData[parseInt(month)].order_count = monthlyorder_count[parseInt(month)]
    }

    return graphData
}