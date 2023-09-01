// ** react imports
import React, { useState, useEffect } from "react";
// ** svg imports
import Pharaoh from "@/components/widgets/SVG/Pharaoh";
import Priest from "@/components/widgets/SVG/Priest";
import Craftsman from "@/components/widgets/SVG/Craftsman";
import Scribe from "@/components/widgets/SVG/Scribe";
import Viziers from "@/components/widgets/SVG/Viziers";
import Noble from "@/components/widgets/SVG/Noble";
// ** web3 module imports
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
// ** hooks & utils imports
import useGuardian, { GuardianID } from "@/hooks/useGuardian";
import { getGuardianAddress } from "@/utils/addressHelper";
import { getPublicClient } from "@/utils/viemHelper";

// default css
const smallText = 'text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-2'

export default function RewardTab() {
    const publicClient = getPublicClient();
    const { open } = useWeb3Modal();

    const guardianAddress = getGuardianAddress();

    const { address, isConnected } = useAccount();
    const [walletConnected, setWalletConnected] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const {
        getPendingReward,
        getBalance,
        getTotalBalance: getGuardianBalance,
        pendingRewards,
        totalBalance: guardianBal,
        guardianInfo,
        fetchGuardianInfo,
        claim,
    } = useGuardian();

    const [craftsmanBal, setCraftsmanBal] = useState<number>(0);
    const [scribeBal, setScribeBal] = useState<number>(0);
    const [priestBal, setPriestBal] = useState<number>(0);
    const [nobleBal, setNobleBal] = useState<number>(0);
    const [vizierBal, setVizierBal] = useState<number>(0);
    const [pharaohBal, setPharaohBal] = useState<number>(0);
    const [shezmuAmount, setShezmuAmount] = useState<number>(0);

    useEffect(() => {
        if (isConnected !== undefined) {
            setWalletConnected(isConnected);
        }
    }, [isConnected]);

    useEffect(() => {
        if (pendingRewards[0] > 0 && guardianInfo?.rewardPerDay && guardianBal && guardianInfo?.claimFee) {
            const rewardPerSec = guardianInfo?.rewardPerDay / 3600 / 24;
            const interval = setInterval(() => {
                setShezmuAmount((prevState) => (prevState + (rewardPerSec / 4) * guardianBal * (100 - guardianInfo?.claimFee) / 100))
            }, 250)
            return () => {
                clearInterval(interval)
            }
        }
    }, [pendingRewards, guardianInfo?.rewardPerDay, shezmuAmount, guardianBal, guardianInfo?.claimFee])

    useEffect(() => {
        if (!guardianAddress || !walletConnected || !getBalance) return;
        (async () => {
            setCraftsmanBal(await getBalance(GuardianID.Craftsman))
            setScribeBal(await getBalance(GuardianID.Scribe))
            setPriestBal(await getBalance(GuardianID.Priest))
            setNobleBal(await getBalance(GuardianID.Noble))
            setVizierBal(await getBalance(GuardianID.Vizier))
            setPharaohBal(await getBalance(GuardianID.Pharaoh))
        })();
    }, [walletConnected, guardianAddress, getBalance, getGuardianBalance])

    const handleClaim = async () => {
        if (
            !guardianAddress ||
            !address ||
            isClaiming ||
            (!(pendingRewards[0] > 0) && !(pendingRewards[1] > 0))
        )
            return;
        try {
            setIsClaiming(true);
            const txnHash = await claim();
            const transaction = await publicClient.waitForTransactionReceipt({
                hash: txnHash || "0x",
            });
            if (transaction.status === "success") {
                getGuardianBalance();
                getPendingReward();
                fetchGuardianInfo();
            }
            setIsClaiming(false);
        } catch (err) {
            console.log("Err ==> ", err);
            setIsClaiming(false);
        }
    };

    const isClaimBtnDisabled = !!!guardianAddress || !!!address || (pendingRewards[0] <= 0 && pendingRewards[1] <= 0) || isClaiming;

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col sm:flex-row items-start'>
                    <div className={`${smallText} w-24 pr-0`}>Your guardians</div>
                    <div className='flex flex-wrap justify-between sm:justify-normal gap-2 sm:gap-6 w-full'>
                        {
                            craftsmanBal > 0 &&
                            <div className='flex flex-col items-center justify-between'>
                                <div className='scale-75'><Craftsman /></div>
                                <div className='text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center'>Craftsman: {craftsmanBal}</div>
                            </div>
                        }
                        {
                            scribeBal > 0 &&
                            <div className='flex flex-col items-center justify-between'>
                                <div className='scale-75'><Scribe /></div>
                                <div className='text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center'>Scribe: {scribeBal}</div>
                            </div>
                        }
                        {
                            priestBal > 0 &&
                            <div className='flex flex-col items-center justify-between'>
                                <div className='scale-75'><Priest /></div>
                                <div className='text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center'>Priest: {priestBal}</div>
                            </div>
                        }
                        {
                            nobleBal > 0 &&
                            <div className='flex flex-col items-center justify-between'>
                                <div className='scale-75'><Noble /></div>
                                <div className='text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center'>Nobles: {nobleBal}</div>
                            </div>
                        }
                        {
                            vizierBal > 0 &&
                            <div className='flex flex-col items-center justify-between'>
                                <div className='scale-75'><Viziers /></div>
                                <div className='text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center'>Viziers: {vizierBal}</div>
                            </div>
                        }
                        {
                            pharaohBal > 0 &&
                            <div className='flex flex-col items-center justify-between'>
                                <div className='scale-75'><Pharaoh /></div>
                                <div className='text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center'>Pharaoh: {pharaohBal}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className='w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col lg:flex-row items-start lg:items-center'>
                    <div className='flex flex-col lg:flex-row items-start lg:items-center'>
                        <div className={smallText}>Your total guardians</div>
                        <div className='text-[#F8D044] text-[28px] sm:text-[32px] font-semibold leading-[102%]'>{guardianBal && guardianBal} <span className='font-[Newsreader] font-normal'>Guardians</span></div>
                    </div>
                    <div className='bg-black rounded-md px-2 py-[3px] text-[#0084FE] text-xs font-medium leading-[18px] ml-0 lg:ml-2 text-center mt-2 lg:mt-0'>{(guardianInfo?.rewardPerDay * guardianBal).toLocaleString(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 0 })}{" "}Shezmu per day for rewards</div>
                    <div className='bg-black text-white rounded-md px-2 py-[3px] text-xs leading-[18px] font-medium mt-2 lg:mt-0 ml-0 lg:ml-2 text-center'>Fee {guardianInfo?.claimFee}%</div>
                </div>
                <div className='w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col lg:flex-row items-start lg:items-center justify-between lg:justify-normal'>
                    <div className='leading-[120%] text-xs font-bold w-24 lg:w-[130px] text-[#A1A1AA]'>Claimable</div>
                    <div className='flex items-center justify-between gap-2 lg:gap-4'>
                        <div className='text-xl font-light text-[#F4F4F5]'>
                            <div className='leading-[120%]'>Shezmu:{" "}
                                {(pendingRewards[0] + shezmuAmount).toLocaleString(undefined, {
                                    maximumFractionDigits: 6,
                                    minimumFractionDigits: 0,
                                }) || 0}
                            </div>
                            <div className='leading-[120%]'>USDC:{" "}
                                {pendingRewards[1].toLocaleString(undefined, {
                                    maximumFractionDigits: 4,
                                    minimumFractionDigits: 0,
                                }) || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {walletConnected ? <button disabled={isClaimBtnDisabled} className='disabled:opacity-60 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]' onClick={handleClaim}>
                {isClaiming ? 'Claimmig...' : 'Claim'}
            </button> : <button className='disabled:opacity-60 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]' onClick={open}>Connect wallet</button>}
            <div className='text-xs font-bold leading-[120%] text-center text-[#A1A1AA]'>This is a disclaimer text to describe the rules of the transaction and what fees are involved.</div>
        </div>
    )
}
