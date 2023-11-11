import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {

    try {
        const { userId } = auth()
        const body = await req.json()
        const { name, date, priority, description } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!name || !date) {
            return new NextResponse('Name or date is missing', { status: 400 })
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

        const event = await prismadb.event.create({
            data: {
                name,
                date,
                priority,
                desc: description,
                storeId: params.storeId
            }
        })

        return new NextResponse(JSON.stringify(event), { status: 201 })

    } catch(error) {
        console.log('[Event_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}



export async function GET(_req: Request, { params }: { params: { storeId: string } }) {
    try {
        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const events = await prismadb.event.findMany({
            where: {
                storeId: params.storeId,
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            }
        })

        return new NextResponse(JSON.stringify(events), { status: 200 })

    } catch(error) {
        console.log('[Events_GET]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}