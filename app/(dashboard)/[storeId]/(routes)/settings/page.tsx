import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import SettingForm from "./components/SettingForm"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Settings',
    description: 'Shopee Admin - Store Settings',
}

/**
 * Note: for sake of simplicity, only test store data can be fetched
 * any logged in userId are currently hided, and we are using static USER_ID to fetch data
 */

export default async function SettingsPage({ params }: { params: { storeId: string } }) {

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
            id: params.storeId,
            userId: process.env.NEXT_PUBLIC_USER_ID
        }
    })

    if(!store) {
        redirect('/')
    }

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SettingForm initData={store}/>
                </div>
            </div>
        </>
    )
}
