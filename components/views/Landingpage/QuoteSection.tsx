// ** style imports
import { BigDescText, QuoteContainer, SuperTitle } from "./style"

export default function QuoteSection() {
    return (
        <QuoteContainer>
            <img src='/image/quote_left.png' className='absolute left-0 -top-80 z-10' alt='left side effect' draggable={false} />
            <img src='/image/quote_right.png' className='absolute right-0 -top-20 z-10' alt='right side effect' draggable={false} />
            <div className='max-w-7xl w-full self-center flex flex-col items-center mt-28 z-20'>
                <SuperTitle className='font-[Newsreader] tracking-[-0.3px] sm:text-start text-center'>
                    “Competition has been shown to be useful up to a certain point and no further, but <span className='text-[#0084FE]'>cooperation</span>, which is the thing <span className='text-[#00a1fe]'>we must strive</span> for today, <span className='text-[#6FCEEC]'>begins where competition leaves off”</span>
                </SuperTitle>
                <BigDescText className='self-center sm:self-start mt-4'>Quote by Franklin D. Roosevelt</BigDescText>
            </div>
        </QuoteContainer>
    )
}