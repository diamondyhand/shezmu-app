import { create } from "zustand";
import { ModalState, ModalAction } from "./type";

export const useModalStore = create<ModalState & ModalAction>((set) => ({
    isGuardianModal: false,
    openGuardianModal: () => set(() => ({ isGuardianModal: true })),
    closeGuardianModal: () => set(() => ({ isGuardianModal: false })),
}));
