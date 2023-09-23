import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(_req: Request, { params }: { params: { categoryId: string } }) {
    try {

        if(!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 })
        }

        //find billboard
        const category = await prismadb.category.findMany({
            where: {
                id: params.categoryId,
            }
        })

        return new NextResponse(JSON.stringify(category), { status: 200 })

    } catch(error) {
        console.log('[Category_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
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

        if(!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 })
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
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })

        return new NextResponse(JSON.stringify(category), { status: 200 })

    } catch(error) {
        console.log('[Category_PATCH]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function DELETE(_req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        if(!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 })
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
        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })

        return new NextResponse(JSON.stringify(category), { status: 200 })

    } catch(error) {
        console.log('[Category_DELETE]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


