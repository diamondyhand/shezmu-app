"use client"
// ** next imports
import { Manrope } from 'next/font/google'
// ** components imports
import TopLandingSection from './TopLandingSection'
import Header from '@/components/widgets/Header'
import ImageSection from './ImageSection'
import PillarsSection from './PillarsSection'
import QuoteSection from './QuoteSection'
import BannerSection from './BannerSection'
import Footer from './Footer'
// ** style imports
import { LandingPageContainer } from './style'

const manrope = Manrope({ subsets: ['latin'] })

export default function LandingPage() {
    return (
        <LandingPageContainer className={manrope.className}>
            <Header />
            <TopLandingSection />
            <ImageSection />
            <PillarsSection />
            <QuoteSection />
            <BannerSection />
            <Footer />
        </LandingPageContainer>
    )
}
