export type ModalState = {
    isGuardianModal: boolean;
};

export type ModalAction = {
    openGuardianModal: () => void;
    closeGuardianModal: () => void;
};

export type GuardianInfoType = {
    pricePerGuardian: number;
    mintLimit: number;
    rewardPerDay: number;
    txnFee: number;
    allFeeTokens: any;
    claimFee: number
}

export type GuardianState = {
    guardianInfo: GuardianInfoType;
    guardianBalance: number;
    pendingReward: number[];
    shezmuBalance: number;
}

export type GuardianAction = {
    getGuardianInfo: () => void;
    getGuardianBalance: (account: `0x${string}`) => void;
    getPendingReward: (account: `0x${string}`) => void;
    getShezmuBalance: (account: `0x${string}`) => void;
    initializeUserInfo: () => void;
}

export type PendingState = {
    isShezmuApproving: boolean
    isTokenApproving: boolean
    isMinting: boolean
    isClaiming: boolean
    isCompounding: boolean
    isSplitting: boolean
}

export type PendingAction = {
    setIsShezmuApproving: (isHandling: boolean) => void;
    setIsTokenApproving: (isHandling: boolean) => void;
    setIsMinting: (isHandling: boolean) => void;
    setIsClaiming: (isHandling: boolean) => void;
    setIsCompounding: (isHandling: boolean) => void;
    setIsSplitting: (isHandling: boolean) => void;
}