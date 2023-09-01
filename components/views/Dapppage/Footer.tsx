// ** next imports
import Image from 'next/image'
// ** mui imports
import Stack from '@mui/material/Stack'
// ** constants imports
import { FooterLinkConfig } from '@/components/widgets/Constants/main'
// ** style imports
import { FooterContainer } from "./style"
import { Divider } from '../Landingpage/style'

export default function Footer() {
    return (
        <FooterContainer>
            <div className="max-w-7xl w-full self-center flex flex-wrap">
                <div className='flex flex-col gap-4 sm:hidden w-full'>
                    {FooterLinkConfig.map(item => (
                        <span className='text-[#E4E4E7] text-sm' key={item}>{item}</span>
                    ))}
                </div>
                <Divider className='mt-16 sm:mt-0' />
                <div className='hidden sm:block py-8 w-full'>
                    <Stack direction='row' flexWrap='wrap' justifyContent='space-between' alignItems='center' gap={2}>
                        <div className='flex flex-wrap gap-6 items-center'>
                            <Image src="/image/logo.png" alt="logo" draggable={false} width={118} height={24} />
                            <div className='hidden sm:flex flex-wrap gap-6'>
                                {FooterLinkConfig.map(item => (
                                    <span className='text-[#E4E4E7] text-sm' key={item}>{item}</span>
                                ))}
                            </div>
                        </div>
                        <span className='text-[#ffde6a] text-base'>&#x40; 2077 Shezmu. All rights reserved.</span>
                    </Stack>
                </div>
                <div className='sm:hidden py-8 w-full flex flex-col items-start'>
                    <div className='flex'>
                        <Image src="/image/logo.png" alt="logo" draggable={false} width={118} height={24} />
                    </div>
                    <div className='mt-4'>
                        <span className='text-[#ffde6a] text-base'>&#x40; 2077 Shezmu. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </FooterContainer >
    )
}
