// ** react imports
import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
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
import { useGuardianStore, usePendingStore } from "@/state/state";
import GuardianImage from "@/components/widgets/Guardian/GuardianImage";

// default css
const smallText =
  "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-2";

const smallGurdianText = "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-2 sm:pl-0 pl-[10px]";

interface RewardTabProps {
  shezmuAmount: number;
  guardianBal: number;
  craftsmanBal: number;
  scribeBal: number;
  priestBal: number;
  nobleBal: number;
  vizierBal: number;
  pharaohBal: number;
}

export default function RewardTab({
  shezmuAmount,
  guardianBal,
  craftsmanBal,
  scribeBal,
  priestBal,
  nobleBal,
  vizierBal,
  pharaohBal,
}: RewardTabProps) {
  const publicClient = getPublicClient();
  const { open } = useWeb3Modal();

  const guardianAddress = getGuardianAddress();

  const { address, isConnected } = useAccount();
  const [walletConnected, setWalletConnected] = useState(false);
  const [
    guardianInfo,
    getGuardianInfo,
    getGuardianBalance,
    getShezmuBalance,
    pendingRewards,
    getPendingReward,
  ] = useGuardianStore((state) => [
    state.guardianInfo,
    state.getGuardianInfo,
    state.getGuardianBalance,
    state.getShezmuBalance,
    state.pendingReward,
    state.getPendingReward,
  ]);

  const [isClaiming, setIsClaiming] = usePendingStore((state) => [state.isClaiming, state.setIsClaiming])
  const [guardianList, setGuardianList] = useState([0, 0, 0, 0, 0, 0]);

  const { claim } = useGuardian();

  useEffect(() => {
    if (isConnected !== undefined) {
      setWalletConnected(isConnected);
    }
  }, [isConnected]);

  const handleClaim = async () => {
    if (
      !guardianAddress ||
      !address ||
      isClaiming ||
      (!(pendingRewards[0] + shezmuAmount > 0) && !(pendingRewards[1] > 0))
    )
      return;
    try {
      setIsClaiming(true);
      const txnHash = await claim();
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txnHash || "0x",
        timeout: 60_000,
      });
      if (transaction.status === "success") {
        getShezmuBalance(address);
        getGuardianBalance(address);
        getPendingReward(address);
        getGuardianInfo();
      }
      setIsClaiming(false);
    } catch (err) {
      console.log("Err ==> ", err);
      setIsClaiming(false);
    }
  };

  const isClaimBtnDisabled =
    !!!guardianAddress ||
    !!!address ||
    (pendingRewards[0] + shezmuAmount <= 0 && pendingRewards[1] <= 0) ||
    isClaiming;

  const updateGuardianList = useCallback((amount: number) => {
    // 1 Guardian: Craftsman
    // 5 Guardian: Scribe
    // 10 Guardian: High Priest
    // 25 Guardian: Nobles
    // 50 Guardians: Viziers
    // 100 Guardian: Pharaoh
    let totalAmount = amount;
    const SIZES = [1, 5, 10, 25, 50, 100];
    let list = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < SIZES.length; i++) {
      var index = SIZES.length - i - 1;
      list[index] = Math.floor((totalAmount / SIZES[index]));
      totalAmount = totalAmount % SIZES[index];
    }
    setGuardianList(list);
  }, [])

  useEffect(() => {
    updateGuardianList(Math.floor(Number(guardianBal)));
  }, [guardianBal])

  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start">
          <div className={`${smallGurdianText} w-24 pr-0`}>Your guardians</div>
          <div className="flex flex-wrap sm:justify-normal gap-0 sm:gap-3 w-full sm:pl-[28px]">
            {guardianList[0] > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='craftsmen' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Craftsman: {guardianList[0]}
                </div>
              </div>
            )}
            {guardianList[1] > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='scribe' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Scribe: {guardianList[1]}
                </div>
              </div>
            )}
            {guardianList[2] > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='priest' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Priest: {guardianList[2]}
                </div>
              </div>
            )}
            {guardianList[3] > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='noble' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Nobles: {guardianList[3]}
                </div>
              </div>
            )}
            {guardianList[4] > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='vizier' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Viziers: {guardianList[4]}
                </div>
              </div>
            )}
            {guardianList[5] > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='pharaoh' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Pharaoh: {guardianList[5]}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col lg:flex-row items-start lg:items-center">
          <div className="flex flex-col lg:flex-row items-start lg:items-center">
            <div className={smallText}>Your total guardians</div>
            <div className="text-[#F8D044] text-[28px] sm:text-[32px] font-semibold leading-[102%]">
              {guardianBal && guardianBal}{" "}
              <span className="font-[Newsreader] font-normal">Guardians</span>
            </div>
          </div>
          <div className="bg-black rounded-md px-2 py-[3px] text-[#0084FE] text-xs font-medium leading-[18px] ml-0 lg:ml-2 text-center mt-2 lg:mt-0">
            {(guardianInfo?.rewardPerDay * guardianBal).toLocaleString(
              undefined,
              { maximumFractionDigits: 6, minimumFractionDigits: 0 }
            )}{" "}
            Shezmu per day for rewards
          </div>
          <div className="bg-black text-white rounded-md px-2 py-[3px] text-xs leading-[18px] font-medium mt-2 lg:mt-0 ml-0 lg:ml-2 text-center">
            Fee {guardianInfo?.claimFee}%
          </div>
        </div>
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col lg:flex-row items-start lg:items-center justify-between lg:justify-normal">
          <div className="leading-[120%] text-xs font-bold w-24 lg:w-[130px] text-[#A1A1AA]">
            Claimable
          </div>
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            <div className="text-xl font-light text-[#F4F4F5]">
              <div className="leading-[120%]">
                Shezmu:{" "}
                {(pendingRewards[0] + shezmuAmount).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 0,
                }) || 0}
              </div>
              <div className="leading-[120%]">
                USDC:{" "}
                {pendingRewards[1].toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                  minimumFractionDigits: 0,
                }) || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
      {walletConnected ? (
        <button
          disabled={isClaimBtnDisabled}
          className="disabled:opacity-60 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]"
          onClick={handleClaim}
        >
          {isClaiming ? "Claiming..." : "Claim"}
        </button>
      ) : (
        <button
          className="disabled:opacity-60 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]"
          onClick={open}
        >
          Connect wallet
        </button>
      )}
    </div>
  );
}
