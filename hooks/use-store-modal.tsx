import { create } from "zustand";

interface useStoreModalStore {
    isOpen: boolean
    onClose: () => void
    onOpen: () => void
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
}))