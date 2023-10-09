import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

/**
 * Note: This route is only for testing purposes
 * Current using static userId and it's for test only
 * All Store APIs are using the same userId
 */


export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { name } = body
        if(!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId: process.env.NEXT_PUBLIC_USER_ID!
            },
            data: {
                name
            }
        })

        return new NextResponse(JSON.stringify(store), { status: 200 })

    } catch(error) {
        console.log('[Store_PATCH]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function DELETE(_req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId: process.env.NEXT_PUBLIC_USER_ID!
            }
        })

        return new NextResponse(JSON.stringify(store), { status: 200 })

    } catch(error) {
        console.log('[Store_DELETE]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}