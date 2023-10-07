import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    const { orderItems } = await req.json()

    if(!orderItems || orderItems.length === 0) {
        return new NextResponse('Order items are required', { status: 400 })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    orderItems.forEach((item: any) => {
        line_items.push({
            quantity: item.quantity,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: `${item.product.name} - Size: ${item.size.name}`,
                },
                unit_amount: Math.round(parseFloat(item.product.price) * item.quantity * 100)
            }
        })
    })

    //create Order
    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            orderItems: {
                create: orderItems.map((item: any) => ({
                    product: {
                        connect: {
                            id: item.product.id
                        }
                    },
                    size: item.size.name,
                    qty: item.quantity
                }))
            }
        }
    })



    //create Checkout Session
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true
        },
        success_url: `${process.env.NEXT_PUBLIC_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id
        }
    })

    return NextResponse.json({ url: session.url }, { headers: corsHeaders })
}