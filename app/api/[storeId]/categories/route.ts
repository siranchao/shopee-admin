import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    try {
        const { userId } = auth()
        const body = await req.json()
        const { name, billboardId } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!name || !billboardId) {
            return new NextResponse('Name or Billboard ID is missing', { status: 400 })
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(category), { status: 200 })

    } catch(error) {
        console.log('[Category_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}



export async function GET(_req: Request, { params }: { params: { storeId: string } }) {

    try {
        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(categories), { status: 200 })

    } catch(error) {
        console.log('[Category_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}