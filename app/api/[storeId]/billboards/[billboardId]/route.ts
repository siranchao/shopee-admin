import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(_req: Request, { params }: { params: { billboardId: string } }) {
    try {

        if(!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 })
        }

        //find billboard
        const billboard = await prismadb.billboard.findMany({
            where: {
                id: params.billboardId,
            }
        })

        return new NextResponse(JSON.stringify(billboard), { status: 200 })

    } catch(error) {
        console.log('[Billboard_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { label, desc, imageUrl } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!label || !imageUrl) {
            return new NextResponse('Label or Image is missing', { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        if(!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 })
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

        //update billboard
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                desc,
                imageUrl
            }
        })

        return new NextResponse(JSON.stringify(billboard), { status: 200 })

    } catch(error) {
        console.log('[Billboard_PATCH]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function DELETE(_req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        if(!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 })
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

        //delete billboard
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        })

        return new NextResponse(JSON.stringify(billboard), { status: 200 })

    } catch(error) {
        console.log('[Billboard_DELETE]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


