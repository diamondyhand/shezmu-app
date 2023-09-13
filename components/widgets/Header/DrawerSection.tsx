// ** mui imports
import Drawer from '@mui/material/Drawer';
// ** npm module
import { Icon } from '@iconify/react';
// ** contants imports
import { IndexRouterLinkConfig, MobileRouterLinkConfig } from '../Constants/main';
import LogowithoutTextSVG from '../SVG/LogowithoutText';
import Link from 'next/link';
import WhiteLogowithoutTextSVG from '../SVG/WhiteLogowithoutText';

interface DrawerSectionProps {
    openDrawer: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

export default function DrawerSection({
    openDrawer,
    toggleDrawer
}: DrawerSectionProps) {
    return (
        <Drawer
            anchor={'left'}
            open={openDrawer}
            onClose={toggleDrawer(false)}
            sx={{ zIndex: 4000, right: '80px !important' }}
        >
            <div className='sm:w-[360px] w-screen bg-black h-screen text-white flex flex-col justify-between opacity-90'>
                <div className='flex items-center justify-between gap-2 p-3 z-20'>
                    <div className='flex items-center gap-2'>
                        <Icon icon="ic:round-menu" fontSize={32} className='cursor-pointer block lg:hidden' onClick={toggleDrawer(false)} />                        
                        <WhiteLogowithoutTextSVG />
                    </div>
                    <button className='bg-white hover:bg-white transition-all p-2 rounded-xl text-black' onClick={toggleDrawer(false)}>
                        <Icon icon="ic:round-close" width={24} height={24} />
                    </button>
                </div>
                <div className='flex flex-col px-4 gap-6 py-6 z-20 mt-8 h-full'>
                    {MobileRouterLinkConfig.map(item => (
                        <Link href={item.link} key={item.title} onClick={toggleDrawer(false)} target={item.title == "DApp" ? "_self": "_blank"}>
                            <div className='font-[Newsreader] text-[24px] font-medium leading-[95%] cursor-pointer'>
                                {item.title}
                                <div className='flex flex-wrap items-center'>
                                    {item.subTitles && item.subTitles.map(item => (
                                        <div className='text-2xl px-6 py-2 cursor-pointer' key={item}>{item}</div>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='px-4 gap-6 py-6'>                            
                    <a href='https://etherscan.io/address/0x5fe72ed557d8a02fff49b3b826792c765d5ce162'>
                        <div className="text-[#A1A1AA]">Shezmu contract</div>
                    </a>
                    <a href='https://etherscan.io/address/0xFE6c938824C5059edB03579c8DE26Ca095933C97'>
                        <div className="text-[#A1A1AA] mt-3">Guardian contract</div>
                    </a>
                </div>
            </div>
        </Drawer>
    )
}
