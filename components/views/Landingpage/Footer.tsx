// ** constants imports
import { useEffect, useState } from 'react';
import { DappRouterLinkConfig, IndexRouterLinkConfig } from "@/components/widgets/Constants/main"
// ** style imports
import { FooterContainer, Divider } from "./style"
import LogoSVG from "@/components/widgets/SVG/Logo"

export default function Footer() {
    const [RouterLinkConfig, setRouterLinkConfig] = useState(IndexRouterLinkConfig);
    useEffect(() => {
        if(window.location.pathname == "/dapp") {
            setRouterLinkConfig(DappRouterLinkConfig);
        } else {
            setRouterLinkConfig(IndexRouterLinkConfig);
        }
    })    

    return (
        <FooterContainer>
            
            <div className="max-w-7xl w-full self-center flex flex-wrap mt-20 sm:mt-12 z-20 px-5 md:px-12 lg:px-16 xl:px-0">              
                <div className="w-full sm:w-1/2 lg:w-1/4">
                    <a href='/dapp' target="_self">
                        <div className={`text-sm text-[#A1A1AA] sm:font-bold cursor-pointer`}>Dapp</div>
                    </a>
                    {/* <a href='https://looksrare.org/collections/0x1d1B79A8C50Df0e11019f822cd3d7E5d485eBdAa' target='_blank'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] sm:font-bold cursor-pointer`}>LooksRare</div>
                    </a>

                    <a href='https://opensea.io/collection/shezmu-guardian' target='_blank'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] sm:font-bold cursor-pointer`}>Opensea</div>
                    </a> */}

                    <a href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x5fE72ed557d8a02FFf49B3B826792c765d5cE162' target='_blank'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] sm:font-bold cursor-pointer`}>Uniswap</div>
                    </a>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/4">
                    <div className={`text-sm text-[#A1A1AA] sm:font-bold hidden sm:block cursor-pointer`}>Socials</div>
                    <a href='https://t.me/shezmueth' target='_blank'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] cursor-pointer`}>Telegram</div>
                    </a>
                    <a href='https://twitter.com/ShezmuTech' target='_blank'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] cursor-pointer`}>Twitter</div>
                    </a>
                    <a href='https://shezmu.gitbook.io/shezmu/introduction/welcome-to-shezmu' target='_blank'>
                        <div className={`text-sm mt-4 mb-16 sm:mb-0 text-[#A1A1AA] cursor-pointer`}>Gitbook</div>
                    </a>
                </div>

                <Divider className="sm:mt-14 mb-8" />
                <div className="mb-8 sm:mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
                    <div className='flex sm:flex-row flex-col-reverse'>
                        <a href='/'>
                            <img className="sm:mt-0 mt-2" src='/image/footer-logo.png' alt='placeholder'/>
                        </a>
                        <div className='sm:flex block'>
                            
                            <a href='https://etherscan.io/address/0x5fe72ed557d8a02fff49b3b826792c765d5ce162' target='_blank'>
                                <div className="text-[#A1A1AA] sm:pl-5">Shezmu contract</div>
                            </a>
                            <a href='https://etherscan.io/address/0x1d1B79A8C50Df0e11019f822cd3d7E5d485eBdAa' target='_blank'>
                                <div className="text-[#A1A1AA] sm:pl-5 sm:pt-0 pt-[10px]">Guardian contract</div>
                            </a>
                            <div className="text-[#A1A1AA] sm:pl-5 flex sm:mt-0 mt-[9px] sm:mb-0 mb-[8px]">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 2-8.4 7.05a1 1 0 0 1-1.2 0L1 2m18 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m18 0v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2"/>
                                </svg>
                                <a href='mailto:shezmus@proton.me' className="pl-[6px]" target='_blank'>
                                    shezmus@proton.me
                                </a>
                            </div>

                        </div>
                    </div>
                    <div className="text-[#D1B03A]">© 2023 Shezmu. All rights reserved.</div>
                </div>
            </div>
        </FooterContainer>
    )
}