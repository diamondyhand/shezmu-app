// ** react && next imports imports
import React, { useEffect, useState } from 'react'
import { Manrope } from 'next/font/google'
// ** style imports
import { MintContainer } from "../style"
// ** mui imports
import { Divider } from '@mui/material'
// ** constants imports
import { TabNameList } from '@/components/widgets/Constants/dapp'
// ** components imports
import MintTab from './MintTab'
import RewardTab from './RewardTab'
import Compound from './Compound'

// next font imports
const manrope = Manrope({ subsets: ['latin'] })

export default function MintSection() {
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        if (TabNameList && TabNameList.length > 0) {
            setActiveTab(TabNameList[0])
        }
    }, [])

    return (
        <MintContainer className={manrope.className}>
            <div className='max-w-7xl w-full self-center flex flex-col items-center px-2 sm:px-5 md:px-12 lg:px-16 xl:px-0'>
                <div className='max-w-5xl w-full flex flex-col gap-8 px-4 py-8 sm:p-8 lg:p-10 border-4 border-[#F8D044] rounded-[40px] bg-[#18181B] overflow-hidden'>
                    <div className='flex items-center justify-start gap-4 text-xl sm:text-2xl font-bold leading-[120%]'>
                        {TabNameList.map((item, index) => (
                            <div key={item} className={`flex items-center transition-all cursor-pointer`}>
                                <div className={`${item === activeTab ? 'text-white' : 'text-[#52525B]'}`} onClick={() => setActiveTab(item)}>{item}</div>
                                {index < TabNameList.length - 1 && <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: 'white', marginLeft: '16px' }} />}
                            </div>
                        ))}
                    </div>
                    {activeTab === 'Mint' && <MintTab />}
                    {activeTab === 'Reward' && <RewardTab />}
                    {activeTab === 'Compound' && <Compound />}
                </div>
            </div>
        </MintContainer>
    )
}
