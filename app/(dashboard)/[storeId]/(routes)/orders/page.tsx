
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import { formatter } from "@/lib/utils"
 
import OrderClient from "./components/Client"
import { OrderColumn } from "./components/columns"


export default async function OrdersPage({ params }: { params: { storeId: string } }) {

    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedOrders: OrderColumn[] = orders.map((order) => ({
        id: order.id,
        phone: order.phone,
        address: order.address,
        isPaid: order.isPaid ? "Yes" : "No",
        products: order.orderItems.map((item) => item.product.name).join(", "),
        totalPrice: formatter.format(order.orderItems.reduce((acc, cur) => acc + Number(cur.product.price), 0)),
        createdAt: format(order.updatedAt, "MMM dd, yyyy")
    }))

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <OrderClient data={formattedOrders} />
                </div>
            </div>
        </>
    )
}