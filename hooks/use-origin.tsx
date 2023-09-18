import { useState, useEffect } from "react"

/**
 * This hook check and returns a window object's origin if it exists.
 * @returns origin
 */
export const useOrigin = () => {
    const [mounted, setMounted] = useState<boolean>(false)
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""


    useEffect(() => {
        setMounted(true)
    }, [])

    if(!mounted) {
        return null
    }

    return origin
}