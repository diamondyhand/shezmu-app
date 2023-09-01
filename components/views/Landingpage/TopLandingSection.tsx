// ** components imports
import LaunchAppBtn from '@/components/widgets/Button/LaunchAppBtn'
// ** style imports
import { TagText } from '@/components/globalStyle'
import { BigDescText, SuperTitle, TopLandingContainer } from './style'

export default function TopLandingSection() {
    return (
        <TopLandingContainer className='landing_bg mix-blend-lighten'>
            <div className='max-w-7xl pt-32 sm:pt-44 w-full self-center h-screen flex flex-col items-center lg:items-start px-5 md:px-12 lg:px-16 xl:px-0'>
                <TagText className='w-max'>Introducing Shezmu</TagText>
                <SuperTitle className='font-[Newsreader] w-full sm:w-4/5 xl:w-3/5 mt-8 text-center lg:text-start'>The Altar of Shezmu Awaits</SuperTitle>
                <BigDescText className='mt-4 mb-6 text-center'>Start your Shezmu journey by clicking launch app</BigDescText>
                <LaunchAppBtn />
            </div>
            <div className='max-w-7xl w-full self-center flex flex-col items-center px-5 md:px-12 lg:px-16 xl:px-0'>
                <SuperTitle className='font-[Newsreader] text-center'>Opportunity awaits</SuperTitle>
                <BigDescText className='mt-4 text-center'>Want to become part of the Shezmu Community? Learn more below</BigDescText>
            </div>
        </TopLandingContainer >
    )
}
