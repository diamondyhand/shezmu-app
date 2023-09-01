// ** style imports
import { HomepageContainer } from "./style"
// ** components imports
import Header from "@/components/widgets/Header"
import MainSection from "./MainSection"

export default function Homepage() {
    return (
        <HomepageContainer className="home_bg">
            <Header />
            <MainSection />
        </HomepageContainer>
    )
}
