// ** react imports
import React, { useEffect, useState } from 'react';
// ** wagmi module
import { useAccount, useNetwork } from 'wagmi'
// ** mui imports
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// ** components imports
import MintGuardianModal from '@/components/widgets/Modals/MintGuardianModal'
// ** hook
import { useModalStore } from '@/state/state';
import useTokenSale from '@/hooks/useTokenSale';
// ** style imports
import { MainSectionContainer } from './style'
import { currentTime } from '@/utils/time';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MainSection() {
    // hook imports
    const { isConnected } = useAccount();
    const [
        isGuardianModal,
        openGuardianModal,
        closeGuardianModal,
    ] = useModalStore((state) => [state.isGuardianModal, state.openGuardianModal, state.closeGuardianModal])
    const { tokenSaleInfo } = useTokenSale();
    const [endTag, setEndTag] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    // react hook imports
    const [walletConnected, setWalletConnected] = React.useState(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    useEffect(() => {
        if (isConnected !== undefined) {
            setWalletConnected(isConnected)
        }
    }, [isConnected])

    useEffect(() => {
        const now = currentTime();
        if (tokenSaleInfo?.endTime > 0 && tokenSaleInfo?.shezmuAmount >= 0 && tokenSaleInfo?.totalShezmuAmount && walletConnected) {
            if (tokenSaleInfo?.endTime < now) {
                setEndTag('Public sale has been ended.')
                closeGuardianModal();
            } else {
                setEndTag('')
                openGuardianModal();
            }
        }
    }, [walletConnected, tokenSaleInfo?.endTime, tokenSaleInfo?.shezmuAmount, tokenSaleInfo?.totalShezmuAmount])

    return (
        <MainSectionContainer isConnected={walletConnected}>
            <div className='font-[Newsreader] text-5xl md:text-6xl xl:text-7xl my-12 font-medium text-center px-4 text-white'>
                The Altar of Shezmu Awaits
            </div>
            {endTag !== '' ? <div className='py-2 px-4 bg-[#18181BBB] rounded-3xl text-[#E5BE30] font-bold leading-[24px] tracking-[-0.4px]'>{endTag}</div> : undefined}
            {/* {walletConnected ? (
                isSoldOut ? <div className='py-2 px-4 bg-[#18181BBB] rounded-3xl text-[#E5BE30] font-bold leading-[24px] tracking-[-0.4px]'>Sold out.</div> : <WalletConnectBtn onClick={openGuardianModal}>Public Sale</WalletConnectBtn>
            ) :
                <ConnectWalletBtn />
            } */}
            <MintGuardianModal open={isGuardianModal} handleClose={(tag: string) => {
                setEndTag(tag);
                closeGuardianModal();
            }} setAlertOpen={setAlertOpen} setSnackMsg={setSnackMsg} />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                sx={{ zIndex: 5000 }}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {snackMsg}
                </Alert>
            </Snackbar>
        </MainSectionContainer>
    )
}