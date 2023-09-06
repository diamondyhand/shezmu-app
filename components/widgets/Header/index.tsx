// ** next & react imports
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Manrope } from 'next/font/google';
// ** mui imports
import Stack from '@mui/material/Stack';
// ** npm module
import { Icon } from '@iconify/react';
// ** components imports
import ConnectWalletBtn from '../Button/ConnectWalletBtn'
import DrawerSection from './DrawerSection';
import LogoSVG from '../SVG/Logo';
import LogowithoutTextSVG from '../SVG/LogowithoutText';
// ** style imports
import { HeaderContainer } from "./style"
import { RouterLinkConfig } from '../Constants/main';
import { useNetwork } from 'wagmi';
import { getWalletClient } from '@/utils/viemHelper';
import { CHAIN_ID } from '@/config/constants/network';

const manrope = Manrope({ subsets: ['latin'] })

export default function Header() {
    // react hook imports
    const [openDrawer, setOpenDrawer] = useState(false);
    const { chain } = useNetwork();
    const walletClient = getWalletClient();

    // functions
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setOpenDrawer(open)
    }

    useEffect(() => {
        if (!walletClient) return;
        if (chain?.id && CHAIN_ID) {
            (async () => {
                if (CHAIN_ID !== chain?.id) {
                    await walletClient.switchChain({ id: Number(CHAIN_ID) });
                }
            })();
        }
    }, [chain?.id])

    return (
        <HeaderContainer className={manrope.className}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <div className=''>
                    <div className='flex items-center gap-2'>
                        <Icon icon="ic:round-menu" fontSize={32} className='cursor-pointer block lg:hidden text-white' onClick={() => setOpenDrawer(true)} />
                        <LogoSVG className='hidden sm:block' />
                        <LogowithoutTextSVG className='block sm:hidden' />
                    </div>
                </div>
                <Stack direction='row' alignItems='center' gap={6}>
                    <div className='hidden md:flex items-center gap-6'>
                        {RouterLinkConfig.map(item => (
                            <Link href={item.link} key={item.title}>
                                <Stack fontSize={14} className='cursor-pointer text-white font-bold' direction='row' alignItems='center' gap={1}>
                                    {item.title}
                                    {item.subTitles && <Icon icon="mingcute:down-line" />}
                                </Stack>
                            </Link>
                        ))}
                    </div>
                    <ConnectWalletBtn />
                </Stack>
            </Stack>
            <DrawerSection openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
        </HeaderContainer>
    )
}
