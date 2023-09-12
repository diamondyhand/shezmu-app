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
                    <a href='/dapp'>
                        <div className={`text-sm text-[#A1A1AA] sm:font-bold cursor-pointer`}>Main</div>
                    </a>
                    <a href='https://opensea.io/collection/shezmu-guardian'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] sm:font-bold cursor-pointer`}>Opensea</div>
                    </a>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/4">
                    <div className={`text-sm text-[#A1A1AA] sm:font-bold hidden sm:block cursor-pointer`}>Socials</div>
                    <a href='https://t.me/shezmueth'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] cursor-pointer`}>Telegram</div>
                    </a>
                    <a href='https://twitter.com/ShezmuTech'>
                        <div className={`text-sm mt-4 text-[#A1A1AA] cursor-pointer`}>Twitter</div>
                    </a>
                    <a href='https://shezmu.gitbook.io/shezmu/introduction/welcome-to-shezmu'>
                        <div className={`text-sm mt-4 mb-16 sm:mb-0 text-[#A1A1AA] cursor-pointer`}>Gitbook</div>
                    </a>
                </div>

                <Divider className="sm:mt-14 mb-8" />
                <div className="mb-8 sm:mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
                    <div className='flex'>
                        <LogoSVG />
                        <div className="text-[#A1A1AA] pl-6">Shezmu contract</div>
                        <div className="text-[#A1A1AA] pl-6">Guardian contract</div>
                    </div>
                    <div className="text-[#D1B03A]">© 2077 Shezmu. All rights reserved.</div>
                </div>
            </div>
        </FooterContainer>
    )
}