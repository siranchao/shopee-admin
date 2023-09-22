"use client"

import { useParams } from "next/navigation"
import { useOrigin } from "@/hooks/use-origin"
import ApiAlert from "./ApiAlert"

interface ApiListProps {
    entityName: string
    entityId: string
}

export default function ApiList({ entityName, entityId }: ApiListProps) {

    const origin = useOrigin()
    const params = useParams()
    const baseUrl = `${origin}/api/${params.storeId}`

    return (
        <>
            <ApiAlert 
                title="GET"
                variant="public"
                desc={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
                title="GET"
                variant="public"
                desc={`${baseUrl}/${entityName}/[${ entityId }]`}
            />
            <ApiAlert 
                title="POST"
                variant="admin"
                desc={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
                title="PATCH"
                variant="admin"
                desc={`${baseUrl}/${entityName}/[${ entityId }]`}
            />
            <ApiAlert 
                title="DELETE"
                variant="admin"
                desc={`${baseUrl}/${entityName}/[${ entityId }]`}
            />
        </>
    )
}

