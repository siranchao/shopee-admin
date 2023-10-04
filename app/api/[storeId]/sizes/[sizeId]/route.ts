import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(_req: Request, { params }: { params: { sizeId: string } }) {
    try {

        if(!params.sizeId) {
            return new NextResponse('Size ID is required', { status: 400 })
        }

        const size = await prismadb.size.findMany({
            where: {
                id: params.sizeId,
            },
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return new NextResponse(JSON.stringify(size), { status: 200 })

    } catch(error) {
        console.log('[Size_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { name, categoryId } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!name || !categoryId) {
            return new NextResponse('Name or categoryId is missing', { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        if(!params.sizeId) {
            return new NextResponse('Size ID is required', { status: 400 })
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

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                categoryId
            }
        })

        return new NextResponse(JSON.stringify(size), { status: 200 })

    } catch(error) {
        console.log('[Size_PATCH]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function DELETE(_req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        if(!params.sizeId) {
            return new NextResponse('Size ID is required', { status: 400 })
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        })

        return new NextResponse(JSON.stringify(size), { status: 200 })

    } catch(error) {
        console.log('[Size_DELETE]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}
