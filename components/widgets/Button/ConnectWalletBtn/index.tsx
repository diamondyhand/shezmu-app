"use client"
// ** next & react imports
import { Manrope } from 'next/font/google'
import React, { useEffect } from 'react'
// ** npm module
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'
import { Icon } from '@iconify/react';
// ** components imports
import { WalletConnectBtn } from '../style'

const manrope = Manrope({ subsets: ['latin'] })

export default function ConnectWalletBtn() {
    // hooks imports
    const { open } = useWeb3Modal();
    const { address, isConnected } = useAccount();
    // react hooks imports
    const [walletConnected, setWalletConnected] = React.useState<boolean>(false)
    // useEffects
    useEffect(() => {
        if (isConnected != undefined) {
            setWalletConnected(isConnected)
        }
    }, [isConnected])

    return (
        <WalletConnectBtn className={manrope.className} onClick={open} isConnected={walletConnected}>
            {!walletConnected ? 'Connect wallet' : (
                <div className='flex items-center gap-2'>
                    {address?.slice(0, 5) + '...' + address?.slice(-5)}
                    <Icon icon="mingcute:down-line" fontSize={20} />
                </div>
            )}
        </WalletConnectBtn>
    )
}
