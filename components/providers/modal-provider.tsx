'use client'

import { useEffect, useState } from "react"
import StoreModal from "../modals/store-modal"


export default function ModalProvider() {
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null
    }

    return (
        <>
            <StoreModal />
        </>
    )
}