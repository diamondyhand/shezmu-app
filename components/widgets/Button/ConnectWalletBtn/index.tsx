"use client"
// ** next & react imports
import { Manrope } from 'next/font/google'
import React, { useEffect } from 'react'
// ** npm module
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Icon } from '@iconify/react';
// ** components imports
import { WalletConnectBtn } from '../style'

const manrope = Manrope({ subsets: ['latin'] })

export default function ConnectWalletBtn() {
    // hooks imports
    const { open } = useWeb3Modal();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const [loading, setLoading] = React.useState<boolean>(false);

    // react hooks imports
    const [walletConnected, setWalletConnected] = React.useState<boolean>(false)

    async function onOpen() {
        setLoading(true);
        await open();
        setLoading(false);
    }

    function onClick() {
        if (isConnected) {
        //   disconnect();
        } else {
          onOpen();
        }
    }
    
    

    // useEffects
    useEffect(() => {
        if (isConnected != undefined) {
            setWalletConnected(isConnected)
            if(isConnected == true && window.location.pathname == "/") {                
                // window.location.href = "/dapp";
            }
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
