'use client'
import { useState, useEffect } from "react"
import Modal from "./Modal"
import { Button } from "../ui/button"

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export default function AlertModal({ isOpen, onClose, onConfirm, loading }: AlertModalProps) {
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
                title="Are you sure?"
                desc="Once deleted, you will not be able to recover it."
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button variant="outline" disabled={loading} onClick={onClose} className="w-1/4">
                        Cancel
                    </Button>
                    <Button variant="destructive" disabled={loading} onClick={onConfirm} className="w-1/4">
                        Continue
                    </Button>
                </div>

            </Modal>
        </>
    )
}