import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


/**
 * Note: This route is only for testing purposes
 * Current using static userId and it's for test only
 * All Store APIs are using the same userId
 */

export async function POST(req: Request) {

    try {
        const { userId } = auth()
        const body = await req.json()
        const { name } = body

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        //check if user is admin
        if(userId !== process.env.NEXT_PUBLIC_USER_ID) {
            return new NextResponse('Unauthorized user', { status: 403 })
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId: userId
            }
        })

        return new NextResponse(JSON.stringify(store), { status: 200 })


    } catch(error) {
        console.log('[Store_POST]' + error);
        return new NextResponse('Internal error', { status: 500 })
    }
}