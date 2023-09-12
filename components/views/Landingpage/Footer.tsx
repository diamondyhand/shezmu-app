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
            
            <div className="max-w-7xl w-full self-center flex flex-wrap mt-20 z-20 px-5 md:px-12 lg:px-16 xl:px-0 gap-y-6">
                {RouterLinkConfig.map(item => (
                    <div key={item.title} className="w-full sm:w-1/2 lg:w-1/4">
                        <div className={`text-sm text-[#A1A1AA] font-bold ${!item.subTitles && 'cursor-pointer'}`}>{item.title}</div>
                        {item.subTitles && (
                            item.subTitles.map(item => (
                                <div key={item} className="font-light leading-[120%] text-[#A1A1AA] mt-4 cursor-pointer">{item}</div>
                            ))
                        )}
                    </div>
                ))}
                <Divider className="sm:mt-16 mb-8" />
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