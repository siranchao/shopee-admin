import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import SettingForm from "./components/SettingForm"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin | Settings',
    description: 'Shopee Admin - Store Settings',
}

export default async function SettingsPage({ params }: { params: { storeId: string } }) {

    const { userId } = auth()
    if(!userId) {
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
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
