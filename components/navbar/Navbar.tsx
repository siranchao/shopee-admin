import { UserButton } from "@clerk/nextjs";
import MainNav from "./Main-nav";
import StoreSwitcher from "./Store-switcher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";


export default async function Navbar() {
    
    const { userId } = auth()
    if(!userId) {
        redirect('/sign-in')
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId: userId
        }
    })

    return (
        <>
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <StoreSwitcher items={stores}/>

                    <MainNav className="mx-6"/>

                    <div className="ml-auto flex items-center space-x-4">
                        <UserButton afterSignOutUrl="/"/>
                    </div>
                </div>                
            </div>
        </>
    )
}