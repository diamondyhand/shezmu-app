import { InfoTextContainer } from "../style"

interface InfoTextProps {
    title: string;
    info: string;
}

export default function InfoText({
    title,
    info,
}: InfoTextProps) {

    return (
        <InfoTextContainer className="bg-transparent">
            <div className="flex items-center gap-4">
                <div className="text-xs font-bold leading-[120%] w-16 min-w-[60px]">{title}</div>
                <div className="text-xl sm:text-[28px] md:text-[32px] font-bold sm:font-semibold leading-[102%] text-[#111928] flex h-[41px] items-center justify-center">{info}</div>
            </div>
            <div className="text-xs text-[#52525B] font-bold leading-[120%]">1 Shezmu = {info} ETH</div>
        </InfoTextContainer>
    )
}
