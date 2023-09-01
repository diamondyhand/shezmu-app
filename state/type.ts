export type ModalState = {
    isGuardianModal: boolean;
};

export type ModalAction = {
    openGuardianModal: () => void;
    closeGuardianModal: () => void;
};
