
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import { formatter } from "@/lib/utils"
 
import OrderClient from "./components/Client"
import { OrderColumn } from "./components/columns"


export default async function OrdersPage({ params }: { params: { storeId: string } }) {

    // Orders without address and phone will not be shown
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
            // phone: {
            //     not: ""
            // },
            // address: {
            //     not: ""
            // }
        },
        include: {
            orderItems: {
                include: {
                    product: {
                        include: {
                            color: true,
                            category: true
                        }
                    }
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
        totalPrice: formatter.format(order.orderItems.reduce((total, item) => Number(item?.product?.price)*item.qty + total, 0)),
        createdAt: format(order.createdAt, "MMM dd, yyyy"),
        orderItems: order.orderItems.map((item) => ({
            id: item.id,
            productName: item.product?.name,
            size: item.size,
            qty: item.qty,
            color: item.product?.color.name,
            price: formatter.format(Number(item.product?.price)),
            category: item.product?.category.name,
        }))
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