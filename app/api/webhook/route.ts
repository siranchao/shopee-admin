import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string
        )

    } catch(error) {
        return new NextResponse('Webhook error', { status: 500 })
    } 

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;
    //combine addresses into one string
    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ]
    const addressString = addressComponents.filter((c) => c !== null).join(", ");

    //check event
    if(event.type === "checkout.session.completed") {
        //update order
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || "",
            },
            include: {
                orderItems: true
            }
        })

        /**
         * update products into archived (optional)
         */

        // const productIds = order.orderItems.map((item) => item.productId);
        // await prismadb.product.updateMany({
        //     where: {
        //         id: {
        //             in: productIds
        //         }
        //     },
        //     data: {
        //         isArchived: true
        //     }
        // })

    }

    return new NextResponse(null, { status: 200 })

}