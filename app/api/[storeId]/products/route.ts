import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    try {
        const { userId } = auth()
        const body = await req.json()
        const { images } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(Object.keys(body).length !== 8) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        if(!images || !images.length) {
            return new NextResponse('Images are required', { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        //check if store is user's own store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId) {
            return new NextResponse('Unauthorized action', { status: 403 })
        }

        const product = await prismadb.product.create({
            data: {
                ...body,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                }
            }
        })

        return new NextResponse(JSON.stringify(product), { status: 200 })

    } catch(error) {
        console.log('[Product_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {

    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || ""
        const colorId = searchParams.get('colorId') || ""
        const sizeId = searchParams.get('sizeId') || ""
        const isFeatured = searchParams.get('isFeatured') === "true"

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId: categoryId ? categoryId : undefined,
                colorId: colorId ? colorId : undefined,
                sizeId: sizeId ? sizeId : undefined,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                updatedAt: "desc"
            }
        })

        return new NextResponse(JSON.stringify(products), { status: 200 })

    } catch(error) {
        console.log('[Product_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}