import { create } from "zustand";
import { ModalState, ModalAction, GuardianState, GuardianAction, GuardianInfoType, PendingState, PendingAction } from "./type";
import { fetchGuardianInfo, fetchGuardianBalance, fetchPendingReward, fetchShezmuBalance } from "./actions";

export const useModalStore = create<ModalState & ModalAction>((set) => ({
    isGuardianModal: false,
    openGuardianModal: () => set(() => ({ isGuardianModal: true })),
    closeGuardianModal: () => set(() => ({ isGuardianModal: false })),
}));

export const useGuardianStore = create<GuardianState & GuardianAction>((set) => ({
    guardianInfo: {
        pricePerGuardian: 0,
        mintLimit: 0,
        rewardPerDay: 0,
        txnFee: 0,
        allFeeTokens: [''],
        claimFee: 0
    },
    guardianBalance: 0,
    pendingReward: [0, 0],
    shezmuBalance: 0,
    async getGuardianInfo() {
        const guardianInfo: GuardianInfoType | undefined = await fetchGuardianInfo();
        set(() => ({ guardianInfo }));
    },
    async getGuardianBalance(account: `0x${string}`) {
        const guardianBalance = await fetchGuardianBalance(account);
        set(() => ({ guardianBalance }))
    },
    async getPendingReward(account: `0x${string}`) {
        const pendingReward = await fetchPendingReward(account);
        set(() => ({ pendingReward }))
    },
    async getShezmuBalance(account: `0x${string}`) {
        const shezmuBalance = await fetchShezmuBalance(account);
        set(() => ({ shezmuBalance }))
    },
    async initializeUserInfo() {
        set(() => ({ guardianBalance: 0, pendingReward: [0, 0], shezmuBalance: 0 }))
    }
}))

export const usePendingStore = create<PendingState & PendingAction>((set) => ({
    isShezmuApproving: false,
    isTokenApproving: false,
    isMinting: false,
    isClaiming: false,
    isCompounding: false,
    setIsShezmuApproving: (isShezmuApproving) => set(() => ({ isShezmuApproving })),
    setIsTokenApproving: (isTokenApproving) => set(() => ({ isTokenApproving })),
    setIsMinting: (isMinting) => set(() => ({ isMinting })),
    setIsClaiming: (isClaiming) => set(() => ({ isClaiming })),
    setIsCompounding: (isCompounding) => set(() => ({ isCompounding })),
}))