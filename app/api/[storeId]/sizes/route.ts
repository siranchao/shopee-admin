import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

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

        const size = await prismadb.size.create({
            data: {
                name,
                categoryId,
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(size), { status: 200 })

    } catch(error) {
        console.log('[Size_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}



export async function GET(req: Request, { params }: { params: { storeId: string } }) {

    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || ""

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        let sizes;

        if(categoryId) {
            sizes = await prismadb.size.findMany({
                where: {
                    storeId: params.storeId,
                    categoryId
                },
                include: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            })
        }
        else {
            sizes = await prismadb.size.findMany({
                where: {
                    storeId: params.storeId
                },
                include: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            })
        }

        return new NextResponse(JSON.stringify(sizes), { status: 200 })

    } catch(error) {
        console.log('[Size_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}