import { Manrope } from 'next/font/google'
import { WalletConnectBtn } from './style'

const manrope = Manrope({ subsets: ['latin'] })

interface ConnectWalletBtnProps {
    onClick: () => void;
}

export default function ConnectWalletBtn({
    onClick
}: ConnectWalletBtnProps) {
    return (
        <WalletConnectBtn className={manrope.className} onClick={onClick}>Connect wallet</WalletConnectBtn>
    )
}
