// ** mui imports
import Drawer from '@mui/material/Drawer';
// ** npm module
import { Icon } from '@iconify/react';
// ** contants imports
import { RouterLinkConfig } from '../Constants/main';
import LogowithoutTextSVG from '../SVG/LogowithoutText';
import Link from 'next/link';

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
            sx={{ zIndex: 4000 }}
        >
            <div className='sm:w-[360px] w-screen bg-black h-screen text-white flex flex-col justify-between'>
                <img src='/image/mobile_menu_bg.png' className='h-full w-full absolute left-0 z-10' />
                <div className='flex items-center justify-between gap-2 p-3 z-20'>
                    <div className='flex items-center gap-2'>
                        <Icon icon="ic:round-menu" fontSize={32} className='cursor-pointer block lg:hidden' onClick={toggleDrawer(false)} />
                        <LogowithoutTextSVG />
                    </div>
                    <button className='bg-[#FADB6D] hover:bg-[#E9B708] transition-all p-2 rounded-xl text-black' onClick={toggleDrawer(false)}>
                        <Icon icon="ic:round-close" width={24} height={24} />
                    </button>
                </div>
                <div className='flex flex-col px-4 gap-6 py-6 z-20 justify-center h-full'>
                    {RouterLinkConfig.map(item => (
                        <Link href={item.link} key={item.title} onClick={toggleDrawer(false)}>
                            <div className='font-[Newsreader] text-[44px] font-medium leading-[95%] cursor-pointer'>
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
            </div>
        </Drawer>
    )
}