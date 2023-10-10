import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar/Navbar"

/**
 * Note: for sake of simplicity, only test store data can be fetched
 * any logged in userId are currently hided, and we are using static USER_ID to fetch data
 */

export default async function DashboardLayout({ children, params }: 
    { children: React.ReactNode, params: { storeId: string } }
) {
    const { userId } = auth()
    if(!userId) {
        redirect('/sign-in')
    }

    /**
     * Double-check if this userID and storeId matches
     * Note: for sake of simplicity, we are allowing test store data
     */
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: process.env.NEXT_PUBLIC_USER_ID
        }
    })

    if(!store) {
        redirect('/')
    }

    return (
        <>
            <Navbar />
            <div>
                {children}
            </div>
        </>
    )
}