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
import { IndexRouterLinkConfig, DappRouterLinkConfig } from '../Constants/main';
import { useNetwork } from 'wagmi';
import { getWalletClient } from '@/utils/viemHelper';
import { CHAIN_ID } from '@/config/constants/network';

const manrope = Manrope({ subsets: ['latin'] })

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}
  
const SocialLink = () => {
    const [isDropDown, setIsDropDown] = useState(false);
    return (
        <>
        <div className="inline-flex">
            <a
                onClick={() => setIsDropDown(!isDropDown)}
                className="py-2 text-sm text-white font-bold cursor-pointer"
            >
                Socials
            </a>

            <div className="relative">
                <button
                    type="button"
                    className="inline-flex items-center justify-center h-full px-2 text-white hover:text-white-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* <div className='absolute right-0 z-10 mt-3 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg '> */}
                <div className={classNames(
                                isDropDown
                                  ? "hidden"
                                  : "block",
                                "absolute right-0 z-10 mt-3 origin-top-right bg-[#18181B] border border-gray-100 rounded-md shadow-lg"
                              )}>
                    <div className="p-2">
                        <a
                            href="https://t.me/shezmueth"
                            className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                        >
                            Telegram
                        </a>
                        <a
                            href="https://twitter.com/ShezmuTech"
                            className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://shezmu.gitbook.io/shezmu/introduction/welcome-to-shezmu"
                            className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                        >
                            Gitbook
                        </a>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default function Header() {
    const [RouterLinkConfig, setRouterLinkConfig] = useState(IndexRouterLinkConfig);
    const [isDapp, setIsDapp] = useState(false);
    useEffect(() => {
        if(window.location.pathname == "/dapp") {
            setIsDapp(true);
            setRouterLinkConfig(DappRouterLinkConfig);
        } else {
            setRouterLinkConfig(IndexRouterLinkConfig);
        }
    })    
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
                        <a href="/">
                            <div>
                                <LogoSVG className='hidden sm:block' />
                                <LogowithoutTextSVG className='block sm:hidden' />
                            </div>
                        </a>                   
                    </div>
                </div>
                
                <Stack direction='row' alignItems='center' gap={6}>
                    <div className='hidden md:flex items-center gap-6'>
                        {RouterLinkConfig?.map(item => (
                            <Link href={item.link} key={item.title}>
                                <Stack fontSize={14} className='cursor-pointer text-white font-bold' direction='row' alignItems='center' gap={1}>
                                    {item.title}
                                    {item.subTitles && <Icon icon="mingcute:down-line" />}
                                </Stack>
                            </Link>
                        ))}
                        {
                            isDapp == false ? <SocialLink /> : <></>
                        }
                    </div>
                    <ConnectWalletBtn />
                </Stack>
            </Stack>
            <DrawerSection openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
        </HeaderContainer>
    )
}
