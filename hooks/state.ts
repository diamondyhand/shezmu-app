import { create } from 'zustand'

type ModalState = {
    isGuardianModal: boolean
}

type ModalAction = {
    openGuardianModal: () => void
    closeGuardianModal: () => void
}

// Create your store, which includes both state and (optionally) actions
export const useModalStore = create<ModalState & ModalAction>((set) => ({
    isGuardianModal: false,
    openGuardianModal: () => set(() => ({ isGuardianModal: true })),
    closeGuardianModal: () => set(() => ({ isGuardianModal: false })),
}))