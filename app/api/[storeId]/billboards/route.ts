import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                desc,
                imageUrl,
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(billboard), { status: 200 })

    } catch(error) {
        console.log('[Billboard_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}



export async function GET(_req: Request, { params }: { params: { storeId: string } }) {

    try {
        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(billboards), { status: 200 })

    } catch(error) {
        console.log('[Billboard_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}