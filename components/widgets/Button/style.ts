import tw from "tailwind-styled-components";

export const WalletConnectBtn = tw.button<{ isConnected?: boolean }>`
    ${({ isConnected }) => isConnected ? 'bg-[#181818] hover:bg-[#202020] text-white' : 'bg-[#FADB6D] hover:bg-[#E9B708] text-black'} transition-all rounded-[12px] px-4 py-2 font-bold tracking-[-0.4px] leading-6 btn_shadow
`

export const LaunchMenuAppButton = tw.button`bg-[#FADB6D] hover:bg-[#E9B708] text-black transition-all rounded-[12px] px-4 py-2 font-bold tracking-[-0.4px] leading-6 btn_shadow
`


export const LaunchAppButton = tw.button`
    text-base sm:text-xl xl:text-2xl bg-[#FADB6D] hover:bg-[#E9B708] transition-all px-4 sm:px-6 py-2 sm:py-4 text-black flex items-center rounded-full font-bold tracking-[-0.6px] gap-2 btn_shadow
`

export const ApproveButton = tw.button<{ isTokenApproved: boolean | undefined }>`
    disabled:opacity-60 opacity-100 rounded-xl bg-[#2C91FE] text-black font-bold leading-6 tracking-[-0.6px] px-4 py-1.5 sm:py-2 w-full lg:w-auto mt-2 lg:mt-0 ${({ isTokenApproved }) => isTokenApproved ? 'hidden' : 'block'}
`