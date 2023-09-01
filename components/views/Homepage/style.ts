import tw from "tailwind-styled-components";

export const HomepageContainer = tw.div`
    bg-white dark:bg-black w-screen h-screen relative overflow-x-hidden relative
`

export const MainSectionContainer = tw.div<{ isConnected: boolean }>`
    w-full h-full flex flex-col justify-center items-center transition-all
`