'use client'
import { useState, useEffect } from "react"
import Modal from "./Modal"
import OrderDetailTable from "@/app/(dashboard)/[storeId]/(routes)/orders/components/OrderDetailTable"

interface OrderModalProps {
    isOpen: boolean
    orderItems: any
    onClose: () => void
}

export default function OrderModal({ isOpen, orderItems, onClose }: OrderModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if(!mounted) {
        return null
    }

    return (
        <>
            <Modal
                title="Order Details"
                desc="This order contains following items"
                className="max-h-[80vh] max-w-[80%] overflow-y-scroll lg:max-w-[60%]"
                isOpen={isOpen}
                onClose={onClose}
            >
                <OrderDetailTable data={orderItems} />
            </Modal>
        </>
    )
}