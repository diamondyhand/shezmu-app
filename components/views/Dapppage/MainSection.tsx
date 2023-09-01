"use client"
// ** react imports
import React from 'react';
// ** style imports
import { MainSectionContainer } from './style'
// ** components imports
import HoldingSection from './HoldingSection';
import MintSection from './MintSection';

export default function MainSection() {

    return (
        <MainSectionContainer>
            <div className={`font-medium text-center`}>
                <div className={`font-[Newsreader] my-4 w-fit text-white text-5xl sm:text-6xl md:text-7xl leading-[95%] m-auto text-center`}>
                    The Altar of Shezmu Awaits
                </div>
                <div className='text-white font-light text-base sm:text-lg'>Now that you are holding, here are the rewards</div>
            </div>
            <HoldingSection />
            <MintSection />
        </MainSectionContainer>
    )
}