import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const convertPriority = (priority: number) => {
    switch (priority) {
        case 1:
            return "Urgent"
        case 2:
            return "Important"
        case 3:
            return "Normal"
        default:
            return ""
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, eventId: string } }) {
    try {
        const { userId } = auth()
        const body = await req.json()

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
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

        await prismadb.event.updateMany({
            where: {
                id: params.eventId,
            },
            data: {
                ...body
            }
        })

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

        const formattedList = events.map((item: any) => ({
            id: item.id,
            name: item.name,
            desc: item.desc,
            priority: convertPriority(item.priority),
            finished: item.finished,
            date: new Date(item.date).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit"
            })
        }))

        return new NextResponse(JSON.stringify(formattedList), { status: 200 })

    } catch(error) {
        console.log('[Event_PATCH]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}


export async function DELETE(_req: Request, { params }: { params: { storeId: string, eventId: string } }) {
    try {
        const { userId } = auth()
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
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

        await prismadb.event.deleteMany({
            where: {
                id: params.eventId,
            }
        })

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

        const formattedList = events.map((item: any) => ({
            id: item.id,
            name: item.name,
            desc: item.desc,
            priority: convertPriority(item.priority),
            finished: item.finished,
            date: new Date(item.date).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit"
            })
        }))

        return new NextResponse(JSON.stringify(formattedList), { status: 200 })

    } catch(error) {
        console.log('[Event_DELETE]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}
