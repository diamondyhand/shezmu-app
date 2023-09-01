// ** react imports
import { Dispatch, SetStateAction, ChangeEvent } from "react";
// ** hooks imports
import useTokenSale from "@/hooks/useTokenSale";
// ** constants & style imports
import { InputRange } from "../../Constants/main";
import { InfoTextContainer } from "../style"

interface InfoTextProps {
    title: string;
    info: string;
    shezmuInputAmount: string;
    setShezmuInputAmount: Dispatch<SetStateAction<string>>;
    setEthInputAmount: Dispatch<SetStateAction<string>>;
    mintPrice: number;
    setAlertOpen: Dispatch<SetStateAction<boolean>>;
    setSnackMsg: Dispatch<SetStateAction<string>>;
    ethBalance: number;
    dialogDisabled: boolean;
}

export default function ShezmuInput({
    title,
    info,
    shezmuInputAmount,
    setShezmuInputAmount,
    setEthInputAmount,
    mintPrice,
    setAlertOpen,
    setSnackMsg,
    ethBalance,
    dialogDisabled
}: InfoTextProps) {
    const { tokenSaleInfo } = useTokenSale();
    // functions
    const handleChangeShezmuInputAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const onlyNumberRegex = /^(\d+\.|\d*\.\d+|\d+)$/
        const targetValue = event.target.value
        if (onlyNumberRegex.test(targetValue) || targetValue === '') {
            setShezmuInputAmount(targetValue)
            setEthInputAmount((Number(targetValue) * mintPrice).toString())
        }
        if (Number(targetValue) * mintPrice > ethBalance) {
            setSnackMsg('Eth amount should be smaller than your balance.')
            setAlertOpen(true)
        } else if (Number(targetValue) > tokenSaleInfo?.totalShezmuAmount - tokenSaleInfo?.shezmuAmount) {
            setSnackMsg('Shezmu amount should be smllaer than left amount.')
            setAlertOpen(true)
        }
    }

    const setShezmuAmountBtn = (inputValue: number) => {
        setShezmuInputAmount(inputValue.toString())
        setEthInputAmount((inputValue * mintPrice).toString());
        if (inputValue * mintPrice > ethBalance) {
            setSnackMsg('Eth amount should be smaller than your balance.')
            setAlertOpen(true)
        }
        if (inputValue > tokenSaleInfo?.totalShezmuAmount - tokenSaleInfo?.shezmuAmount) {
            setSnackMsg('Shezmu amount should be smllaer than left amount.')
            setAlertOpen(true)
        }
    }

    return (
        <InfoTextContainer className="sm:flex-col sm:items-start gap-2">
            <div className="flex items-center gap-4 w-full">
                <div className="text-xs font-bold leading-[120%] w-16 min-w-[60px]">{title}</div>
                <input className="text-[32px] font-semibold leading-[102%] w-full text-[#111928] h-[41px] bg-[#F3F4F6] outline-none border-none" placeholder={info} value={shezmuInputAmount} onChange={(event) => handleChangeShezmuInputAmount(event)} disabled={dialogDisabled} />
            </div>
            <div className="flex items-center gap-6">
                {InputRange.map(item => (
                    <button disabled={dialogDisabled} className="disabled:opacity-50 bg-[#A1A1AA] p-2 text-[#FAFAFA] text-[10px] font-bold leading-[120%] rounded-xl" key={item.value} onClick={() => setShezmuAmountBtn(item.value)}>{item.label}</button>
                ))}
            </div>
        </InfoTextContainer>
    )
}
