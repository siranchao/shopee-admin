'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"

interface ModalProps {
    title: string
    desc: string
    isOpen: boolean
    children?: React.ReactNode
    onClose: () => void
}


export default function Modal({ title, desc, isOpen, children, onClose }: ModalProps) {

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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{desc}</DialogDescription>
                    </DialogHeader>

                    <div>{children}</div>
                </DialogContent>
            </Dialog>
        </>
    )
}