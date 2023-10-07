'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"

interface ModalProps {
    title: string
    desc: string
    isOpen: boolean
    children?: React.ReactNode
    className?: string
    onClose: () => void
}


export default function Modal({ title, desc, isOpen, children, className, onClose }: ModalProps) {

    const onChange = (open: boolean) => {
        if(!open) {
            onClose()
        }
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={onChange}
            >
                <DialogContent className={className}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{desc}</DialogDescription>
                    </DialogHeader>

                    <>{children}</>
                </DialogContent>
            </Dialog>
        </>
    )
}