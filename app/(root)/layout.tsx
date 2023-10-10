import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"


/**
 * Note: for sake of simplicity, only test store data can be fetched
 * any logged in userId are currently hided, and we are using static USER_ID to fetch data
 */

export default async function HomeLayout({ children }: { children: React.ReactNode }) {

    const { userId } = auth()
    if(!userId) {
        redirect('/sign-in')
    }


    /**
     * Should return first store by current user
     * Note: for sake of simplicity, we are allowing test store data
     */
    const store = await prismadb.store.findFirst({
        where: {
            userId: process.env.NEXT_PUBLIC_USER_ID
        }
    })

    /**
     * if this user has a store, redirect to /storeId page
     */
    if(store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}