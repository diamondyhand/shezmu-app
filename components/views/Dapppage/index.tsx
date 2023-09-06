"use client"
import Header from "@/components/widgets/Header"
import Footer from "./Footer"
import { DapppageContainer } from "./style"
import MainSection from "./MainSection"

export default function Homepage() {
    return (
        <DapppageContainer className="dapp_bg relative">
            <Header />
            <MainSection />
        </DapppageContainer>
    )
}
