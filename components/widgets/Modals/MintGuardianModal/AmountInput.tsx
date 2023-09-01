// ** react & next imports
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';
// ** UI module imports
import { Icon } from '@iconify/react';
// ** constants & styles imports
import { InfoTextContainer } from '../style'
import useTokenSale from '@/hooks/useTokenSale';

interface AmountInputProps {
    ethBalance: number;
    ethInputAmount: string;
    setEthInputAmount: Dispatch<SetStateAction<string>>;
    setShezmuInputAmount: Dispatch<SetStateAction<string>>;
    mintPrice: number;
    setAlertOpen: Dispatch<SetStateAction<boolean>>;
    setSnackMsg: Dispatch<SetStateAction<string>>;
    dialogDisabled: boolean;
    maxInputAmountOfETH: number;
    userPurchasedETH: number;
}

export default function AmountInput({
    ethBalance,
    ethInputAmount,
    setEthInputAmount,
    setShezmuInputAmount,
    mintPrice,
    setAlertOpen,
    setSnackMsg,
    dialogDisabled,
    maxInputAmountOfETH,
    userPurchasedETH
}: AmountInputProps) {
    // functions
    const handleChangeEthInputAmount = (event: ChangeEvent<HTMLInputElement>) => {
        if (!dialogDisabled) {
            const onlyNumberRegex = /^(\d+\.|\d*\.\d+|\d+)$/
            const targetValue = event.target.value
            if (onlyNumberRegex.test(targetValue) || targetValue === '') {
                setEthInputAmount(targetValue)
                setShezmuInputAmount((Number(targetValue) / mintPrice).toString());
            }
        }
    }

    const handleSetMax = async () => {
        if (!dialogDisabled) {
            setEthInputAmount(maxInputAmountOfETH.toString())
            setShezmuInputAmount((maxInputAmountOfETH / mintPrice).toString());
        }
    }

    const handlePlus = () => {
        if (!dialogDisabled) {
            if (Number(ethInputAmount) + 0.1 > maxInputAmountOfETH) {
                handleSetMax()
            } else {
                setEthInputAmount((Number(ethInputAmount) + 0.1).toString())
                setShezmuInputAmount(((Number(ethInputAmount) + 0.1) / mintPrice).toString());
            }
        }
    }

    const handleMinus = () => {
        if (!dialogDisabled) {
            if (Number(ethInputAmount) < 0.1) {
                setEthInputAmount('0');
                setShezmuInputAmount('0');
            } else {
                setEthInputAmount((Number(ethInputAmount) - 0.1).toString());
                setShezmuInputAmount(((Number(ethInputAmount) - 0.1) / mintPrice).toString());
            }
        }
    }

    useEffect(() => {
        if (Number(ethInputAmount) > maxInputAmountOfETH) {
            setSnackMsg('Please input the amount correctly.');
            setAlertOpen(true);
        }
    }, [ethInputAmount])

    return (
        <div className='mt-6'>
            <div className="px-6 text-xs text-[#52525B] font-bold leading-[120%]">A total of 2 ETH may be purchased per wallet, you have already purchased {userPurchasedETH.toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 0 })} ETH</div>
            <InfoTextContainer className='mt-1'>
                <div className='flex items-center gap-0 sm:gap-4 w-full sm:w-max'>
                    <div className="text-xs font-bold leading-[120%] pr-5 min-w-[60px]">ETH</div>
                    <input className="text-xl sm:text-[28px] md:text-[32px] font-semibold leading-[102%] w-full text-[#111928] h-[41px] bg-[#F3F4F6] outline-none border-none block sm:hidden" placeholder='0' value={ethInputAmount} onChange={(event) => handleChangeEthInputAmount(event)} disabled={dialogDisabled} />
                    <div className='flex flex-col gap-2 sm:hidden'>
                        <div className='flex items-center gap-4'>
                            <button className='disabled:opacity-50 p-2 rounded-full bg-[#141414] text-white w-[30px] h-[30px] flex items-center justify-center' onClick={handleMinus} disabled={dialogDisabled || Number(ethInputAmount) <= 0}><Icon icon="ic:round-minus" fontSize={20} /></button>
                            <button className='disabled:opacity-50 p-2 rounded-full bg-[#141414] text-white w-[30px] h-[30px] flex items-center justify-center' onClick={handlePlus} disabled={dialogDisabled || Number(ethInputAmount) >= maxInputAmountOfETH}><Icon icon="ic:round-plus" fontSize={20} /></button>
                        </div>
                        <button className='disabled:opacity-50 p-2 rounded-full bg-[#141414] text-white text-xs h-[30px] flex items-center justify-center' onClick={() => handleSetMax()} disabled={dialogDisabled || Number(ethInputAmount) === maxInputAmountOfETH}>Set max</button>
                    </div>
                    <div className='flex-col sm:flex-row items-center gap-2 sm:gap-4 w-max hidden sm:flex'>
                        <div className='flex items-center gap-4'>
                            <button className='disabled:opacity-50 p-2 rounded-full bg-[#141414] text-white w-[30px] h-[30px] flex items-center justify-center' onClick={handleMinus} disabled={dialogDisabled || Number(ethInputAmount) <= 0}><Icon icon="ic:round-minus" fontSize={20} /></button>
                            <input className="text-xl sm:text-[28px] md:text-[32px] font-semibold leading-[102%] w-full max-w-[120px] text-[#111928] h-[41px] bg-[#F3F4F6] outline-none border-none" placeholder='0' value={ethInputAmount} onChange={(event) => handleChangeEthInputAmount(event)} disabled={dialogDisabled} />
                            <button className='disabled:opacity-50 p-2 rounded-full bg-[#141414] text-white w-[30px] h-[30px] flex items-center justify-center' onClick={handlePlus} disabled={dialogDisabled || Number(ethInputAmount) >= maxInputAmountOfETH}><Icon icon="ic:round-plus" fontSize={20} /></button>
                        </div>
                        <button className='disabled:opacity-50 p-2 rounded-full bg-[#141414] text-white text-xs h-[30px] flex items-center justify-center' onClick={() => handleSetMax()} disabled={dialogDisabled || Number(ethInputAmount) === maxInputAmountOfETH}>Set max</button>
                    </div>
                </div>
                <div className="text-xs text-[#52525B] font-bold leading-[120%]">Your ETH Balance = {ethBalance.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })} ETH</div>
            </InfoTextContainer>
        </div>
    )
}
