import LaunchAppBtn from "@/components/widgets/Button/LaunchAppBtn"
import { BannerContainer } from "./style"

export default function BannerSection() {
    return (
        <BannerContainer>
            <div className='max-w-7xl w-full self-center flex flex-col items-center mt-28 px-5 md:px-12 lg:px-16 xl:px-0'>
                <div className="w-full h-full md:h-[186px] bg-gradient-to-b from-black to-[#18181b80] hover:to-[#755c0480] py-12 sm:py-16 px-8 sm:px-16 rounded-[32px] border border-[#D1B03A] flex flex-col md:flex-row items-center justify-between z-20 cursor-pointer transition-all">
                    <div className="text-5xl font-bold leading-[120%] text-white">Get started now</div>
                    <LaunchAppBtn className='w-full md:w-auto mt-8 md:mt-0 justify-center' />
                </div>
            </div>
        </BannerContainer>
    )
}
