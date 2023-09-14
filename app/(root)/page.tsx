'use client'
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/custom/Modal";

import { useStoreModal } from "@/hooks/use-store-modal";


export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if(!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return (
    <>
      <div className="p-4">
        ROOT PAGE
      </div>
    </>
  )

}
  