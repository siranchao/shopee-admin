'use client'

import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Server, Copy } from "lucide-react"
import { Badge, BadgeProps } from "../ui/badge"
import { Button } from "../ui/button"
import toast from "react-hot-toast"

interface ApiAlertProps {
    title: string
    desc: string
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin",
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive",
}



export default function ApiAlert({ title, desc, variant }: ApiAlertProps) {

    const onCopy = (desc: string) => {
        //use browser api
        navigator.clipboard.writeText(desc)
        toast.success("API route copied")
    }

    return (
        <>
            <Alert>                  
                <AlertTitle className="flex items-center gap-x-4">
                    <Server className="h-4 w-4"/>
                    <span>{title}</span>
                    <Badge variant={variantMap[variant]}>
                        {textMap[variant]}
                    </Badge>
                </AlertTitle>

                <AlertDescription className="mt-4 flex items-center justify-between">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {desc}
                    </code>
                    <Button variant="outline" size="sm" onClick={() => {onCopy(desc)}} >
                        <Copy className="h-4 w-4"/>
                    </Button>
                </AlertDescription>
            </Alert>
        </>
    )
}