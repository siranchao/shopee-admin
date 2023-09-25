import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    try {
        const { userId } = auth()
        const body = await req.json()
        const { name, value } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!name || !value) {
            return new NextResponse('Name or value is missing', { status: 400 })
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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(color), { status: 200 })

    } catch(error) {
        console.log('[Color_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}



export async function GET(_req: Request, { params }: { params: { storeId: string } }) {

    try {
        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(colors), { status: 200 })

    } catch(error) {
        console.log('[Color_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}