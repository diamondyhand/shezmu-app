// ** style imports
import { PillarsContainer, SuperTitle, SubTitle, DescText } from "./style"
// ** constant imports
import { PillarsConfig, ShezmuOfferConfig } from '@/components/widgets/Constants/Pillars'

export default function PillarsSection() {
    return (
        <PillarsContainer>
            <div className='max-w-7xl w-full self-center flex flex-col items-center px-5 md:px-12 lg:px-16 xl:px-0'>
                <SuperTitle className='font-[Newsreader] mt-28 w-full md:w-2/3 text-center'>Shezmu&apos;s Three pillars</SuperTitle>
                <div className='flex flex-wrap items-start justify-center gap-y-8 mt-12'>
                    {PillarsConfig.map(item => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className='w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center'>
                                {Icon()}
                                <SubTitle className='mt-5'>{item.title}</SubTitle>
                                <DescText className='mt-2'>{item.description}</DescText>
                            </div>
                        )
                    })}
                </div>
                <div className='font-[Newsreader] text-[#E4E4E4] text-5xl font-medium leading-[95%] mt-28 text-center'>What does Shezmu offer?</div>
                <div className='flex items-start flex-wrap justify-center gap-y-8 mt-12'>
                    {ShezmuOfferConfig.map(item => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className='w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center justify-between'>
                                {Icon()}
                                <SubTitle className='mt-5'>{item.title}</SubTitle>
                                <DescText className='mt-2'>{item.description}</DescText>
                            </div>
                        )
                    })}
                </div>
            </div>
        </PillarsContainer>
    )
}
