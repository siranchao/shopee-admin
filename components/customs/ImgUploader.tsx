"use client"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"

interface ImgUploaderProps {
    disabled?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}



export default function ImgUploader({ disabled, onChange, onRemove, value }: ImgUploaderProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])


    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
    }


    if(!mounted) {
        return null
    }

    return (
        <>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant={"destructive"} size="sm">
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>

                        <Image 
                            fill
                            src={url}
                            alt="Image"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget onUpload={onUpload} uploadPreset="shopee_admin">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button type="button" disabled={disabled} onClick={onClick} variant="secondary">
                            <ImagePlus className="mr-2 h-5 w-5"/>
                            Upload
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </>
    )
}