// ** react & next imports
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
// ** wagmi imports
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
// ** components imports
import ApproveBtn from "@/components/widgets/Button/ApproveBtn";
import TokenSelect from "@/components/widgets/TokenSelect";
// ** constants imports
import { TokenListTypes } from "@/components/widgets/Constants/type";
import { ZERO_ADDRESS } from "@/config/constants/network";
// ** web3 module imports
import { useWeb3Modal } from "@web3modal/react";
// ** hooks & utils imports
import useGuardian from "@/hooks/useGuardian";
import useERC20Token from "@/hooks/useERC20Token";
import { getGuardianAddress } from "@/utils/addressHelper";
import { getPublicClient } from "@/utils/viemHelper";
import { getDecimals } from "@/utils/erc20";
import { useGuardianStore, usePendingStore } from "@/state/state";

// default css
const smallText =
  "text-xs font-bold leading-[120%] text-[#A1A1AA] w-auto sm:w-[130px] pr-2";

interface CompoundProps {
  selectedTokenAllowance: number;
  updateSelectedTokenAllowance: () => void;
  selectedToken: TokenListTypes | undefined;
  setSelectedToken: Dispatch<SetStateAction<TokenListTypes | undefined>>;
  shezmuAmount: number;
  updateGuardianBalance: () => void;
}

export default function Compound({
  selectedTokenAllowance,
  updateSelectedTokenAllowance,
  selectedToken,
  setSelectedToken,
  shezmuAmount,
  updateGuardianBalance,
}: CompoundProps) {
  const guardianAddress = getGuardianAddress();
  const [
    guardianInfo,
    getGuardianInfo,
    getGuardianBalance,
    pendingRewards,
    getPendingReward,
  ] = useGuardianStore((state) => [
    state.guardianInfo,
    state.getGuardianInfo,
    state.getGuardianBalance,
    state.pendingReward,
    state.getPendingReward,
  ]);

  const [
    isTokenApproving,
    isCompounding,
    setIsTokenApproving,
    setIsCompounding,
  ] = usePendingStore((state) => [
    state.isTokenApproving,
    state.isCompounding,
    state.setIsTokenApproving,
    state.setIsCompounding,
  ]);

  // react hooks
  const [guardianAmount, setGuardianAmount] = useState("1");
  const [inputError, setInputError] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState<String>("");
  const [isTokenApproved, setIsTokenApproved] = useState(true);

  // hooks
  const { address, isConnected } = useAccount();
  const { compound } = useGuardian();
  const { approve: selectedTokenApprove } = useERC20Token(
    selectedToken?.address || ZERO_ADDRESS
  );
  const publicClient = getPublicClient();
  const { open } = useWeb3Modal();

  // functions
  const handleInputGuardianAmount = (guardianAmount: string) => {
    const regex = /^(\d+|0)?$/;
    if (regex.test(guardianAmount)) {
      setGuardianAmount(guardianAmount);
      if (
        Number(guardianAmount) * guardianInfo?.pricePerGuardian >
        pendingRewards[0]
      ) {
        setInputError("error");
      } else {
        setInputError("");
      }
    }
  };

  const handleSelectedTokenApprove = async () => {
    if (
      !guardianAddress ||
      !guardianAmount ||
      !address ||
      !selectedTokenApprove
    )
      return;
    try {
      const tokenDecimal = await getDecimals(
        selectedToken?.address as `0x${string}`
      );
      const approveAmount = parseUnits(
        guardianInfo?.txnFee.toString(),
        tokenDecimal
      );
      setIsTokenApproving(true);
      const txnHash = await selectedTokenApprove(
        guardianAddress,
        approveAmount
      );
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txnHash || "0x",
        timeout: 60_000,
      });
      if (transaction.status === "success") {
        updateSelectedTokenAllowance();
      }
      setIsTokenApproving(false);
    } catch (err) {
      console.log(err);
      setError((err as Error).message);
      setIsTokenApproving(false);
    }
  };

  const handleCompound = async () => {
    if (
      !guardianAddress ||
      !address ||
      isMintBtnDisabled ||
      !selectedToken ||
      !compound
    )
      return;
    try {
      setIsCompounding(true);
      const txnHash = await compound(
        address,
        selectedToken.address,
        BigInt(guardianAmount)
      );
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txnHash || "0x",
        timeout: 60_000,
      });
      if (transaction.status === "success") {
        getGuardianBalance(address);
        getPendingReward(address);
        getGuardianInfo();
        updateSelectedTokenAllowance();
        updateGuardianBalance();
      }
      setIsCompounding(false);
    } catch (err) {
      console.log(err);
      setIsCompounding(false);
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    if (isConnected !== undefined) {
      setWalletConnected(isConnected);
    }
  }, [isConnected]);

  useEffect(() => {
    if (walletConnected) {
      updateSelectedTokenAllowance();
    }
  }, [walletConnected, updateSelectedTokenAllowance]);

  useEffect(() => {
    if (!address) {
      setIsTokenApproved(true);
      return;
    }
    if (guardianInfo?.txnFee && selectedTokenAllowance !== undefined) {
      setIsTokenApproved(
        !selectedToken || selectedTokenAllowance >= guardianInfo?.txnFee
      );
    }
  }, [selectedToken, selectedTokenAllowance, guardianInfo?.txnFee, address]);

  const isMintBtnDisabled =
    !walletConnected ||
    pendingRewards[0] + shezmuAmount <= 0 ||
    Number(guardianAmount) * guardianInfo?.pricePerGuardian >
      pendingRewards[0] + shezmuAmount ||
    isCompounding ||
    !isTokenApproved;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col sm:flex-row items-start sm:items-center">
          <div className={smallText}>Your claimable Shezmu</div>
          <div className="text-[#F8D044] text-[28px] sm:text-[32px] font-semibold leading-[102%]">
            {(pendingRewards &&
              (pendingRewards[0] + shezmuAmount).toLocaleString(undefined, {
                maximumFractionDigits: 4,
                minimumFractionDigits: 0,
              })) ||
              0}
          </div>
        </div>
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto justify-between">
            <div className="leading-[120%] text-[#A1A1AA] text-xs font-bold w-auto sm:w-[130px]">
              How many you are going to mint
            </div>
            <div>
              <div className="flex items-center gap-4 sm:gap-6 justify-between">
                <input
                  placeholder="0"
                  className={`text-[28px] sm:text-[32px] font-semibold ${
                    inputError ? "border border-red-600" : "border-none"
                  } leading-[102%] outline-none rounded-2xl bg-[#18181B] text-[#F8D044] text-center px-6 py-1 w-32 mt-2 sm:mt-0`}
                  value={guardianAmount}
                  onChange={(e) => handleInputGuardianAmount(e.target.value)}
                />
                <div className="text-xs font-light hidden sm:block">
                  <div className="leading-[120%] text-white">
                    1 Guardian = {guardianInfo?.pricePerGuardian} Shezmu
                  </div>
                  <div className="text-transparent bg-clip-text bg-gradient-to-b from-[#0084FE] to-[#6FCEEC] leading-[120%] font-bold">
                    Total Shezmu : {guardianAmount} *{" "}
                    {guardianInfo?.pricePerGuardian} ={" "}
                    {Number(guardianAmount) * guardianInfo?.pricePerGuardian}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-light block sm:hidden mt-2">
            <div className="leading-[120%] text-white">
              1 Guardian = {guardianInfo?.pricePerGuardian} Shezmu
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-b from-[#0084FE] to-[#6FCEEC] leading-[120%] font-bold">
              Total Shezmu : {guardianAmount} * {guardianInfo?.pricePerGuardian}{" "}
              = {Number(guardianAmount) * guardianInfo?.pricePerGuardian}
            </div>
          </div>
        </div>
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className={smallText}>Mint fee</div>
            <div className="text-white text-[28px] sm:text-[32px] font-semibold leading-[102%]">
              $
              {guardianInfo?.txnFee.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start sm:items-center gap-1 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
            <TokenSelect
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              tokens={guardianInfo?.allFeeTokens}
            />
            <ApproveBtn
              isTokenApproved={isTokenApproved}
              className="mt-2 sm:mt-0"
              isApproving={isTokenApproving}
              onClick={handleSelectedTokenApprove}
            />
          </div>
        </div>
      </div>
      {walletConnected ? (
        <button
          disabled={isMintBtnDisabled}
          className="disabled:opacity-50 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]"
          onClick={() => handleCompound()}
        >
          {isCompounding ? "Compounding..." : "Compound"}
        </button>
      ) : (
        <button
          className="disabled:opacity-50 opacity-100 bg-[#F8D044] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%] mt-2 sm:mt-0"
          onClick={open}
        >
          Connect wallet
        </button>
      )}
    </div>
  );
}
