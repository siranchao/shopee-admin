import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(_req: Request, { params }: { params: { productId: string } }) {
    try {

        if(!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 })
        }

        const product = await prismadb.product.findMany({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
            }
        })

        return new NextResponse(JSON.stringify(product), { status: 200 })

    } catch(error) {
        console.log('[Product_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
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

        if(!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 })
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                ...body,
                images: {
                    deleteMany: {},
                }
            }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
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
        console.log('[Product_PATCH]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function DELETE(_req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        if(!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 })
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        return new NextResponse(JSON.stringify(product), { status: 200 })

    } catch(error) {
        console.log('[Product_DELETE]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


