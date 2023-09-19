// ** react imports
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
// ** wagmi && viem imports
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { parseEther, parseUnits } from "viem";
// ** components imports
import ApproveBtn from "@/components/widgets/Button/ApproveBtn";
import TokenSelect from "@/components/widgets/TokenSelect";
// ** constants imports
import { TokenListTypes } from "@/components/widgets/Constants/type";
import { ZERO_ADDRESS } from "@/config/constants/network";
// ** utils & hooks imports
import useERC20Token from "@/hooks/useERC20Token";
import useGuardian from "@/hooks/useGuardian";
import { getGuardianAddress, getShezmuAddress } from "@/utils/addressHelper";
import { getPublicClient } from "@/utils/viemHelper";
import { getDecimals } from "@/utils/erc20";
import { useGuardianStore, usePendingStore } from "@/state/state";
import { ApproveSection } from "@/components/widgets/Button/style";

// default css
const smallText =
  "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-2";

type ErrorTypes = {
  code: Number;
  message: String;
};

type MintTabProps = {
  shezmuBalance: number;
  shezmuAllowance: number;
  selectedTokenAllowance: number;
  selectedToken: TokenListTypes | undefined;
  setSelectedToken: Dispatch<SetStateAction<TokenListTypes | undefined>>;
  updateShezmuAllowance: () => void;
  updateSelectedTokenAllowance: () => void;
  updateGuardianBalance: () => void;
};

export default function MintTab({
  shezmuBalance,
  shezmuAllowance,
  selectedTokenAllowance,
  selectedToken,
  setSelectedToken,
  updateShezmuAllowance,
  updateSelectedTokenAllowance,
  updateGuardianBalance,
}: MintTabProps) {
  const { open } = useWeb3Modal();
  const publicClient = getPublicClient();
  const guardianAddress = getGuardianAddress();
  const shezmuAddress = getShezmuAddress();
  // hooks
  const { address, isConnected } = useAccount();
  const { mint: mintGuardian } = useGuardian();
  const [guardianInfo, getGuardianInfo, getGuardianBalance, pendingRewards ,getShezmuBalance] =
    useGuardianStore((state) => [
      state.guardianInfo,
      state.getGuardianInfo,
      state.getGuardianBalance,
      state.pendingReward,
      state.getShezmuBalance,
    ]);
  const [
    isShezmuApproving,
    isTokenApproving,
    isMinting,
    setIsShezmuApproving,
    setIsTokenApproving,
    setIsMinting,
  ] = usePendingStore((state) => [
    state.isShezmuApproving,
    state.isTokenApproving,
    state.isMinting,
    state.setIsShezmuApproving,
    state.setIsTokenApproving,
    state.setIsMinting,
  ]);
  const { approve: shezmuApprove } = useERC20Token(shezmuAddress);
  const { approve: selectedTokenApprove } = useERC20Token(
    selectedToken?.address || ZERO_ADDRESS
  );
  const [guardianAmount, setGuardianAmount] = useState("1");
  const [inputError, setInputError] = useState("");
  const [error, setError] = useState<String>("");
  const [isShezmuApproved, setIsShezmuApproved] = useState(true);
  const [isTokenApproved, setIsTokenApproved] = useState(true);
  const { getTokenAllowance } = useGuardian();


  console.log('pendingReward is ', pendingRewards);
  const isHidden = (pendingRewards[1] >= guardianInfo?.txnFee);
  const approveSection = !isHidden ? 'flex flex-col md:flex-row items-start sm:items-center gap-1 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0' : 'hidden flex-col md:flex-row items-start sm:items-center gap-1 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0'

  // funcitons
  const handleInputGuardianAmount = (guardianAmount: string) => {
    const regex = /^(\d+|0)?$/;
    if (regex.test(guardianAmount)) {
      setGuardianAmount(guardianAmount);
      if (Number(guardianAmount) > guardianInfo?.mintLimit) {
        setInputError(
          `You can't mint Guardian than ${guardianInfo?.mintLimit} at one time.`
        );
      } else {
        setInputError("");
      }
    }
  };
  const handleShezmuApprove = async () => {
    if (!guardianAddress || !guardianAmount || !address || !shezmuApprove)
      return;
    try {
      setIsShezmuApproving(true);
      const txnHash = await shezmuApprove(
        guardianAddress,
        parseEther(
          (Number(guardianAmount) * guardianInfo?.pricePerGuardian).toString()
        )
      );
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txnHash || "0x",
        timeout: 60_000,
      });
      if (transaction.status === "success") {
        updateShezmuAllowance();
      }
      setIsShezmuApproving(false);
    } catch (err) {
      console.log(err);
      setError((err as ErrorTypes).message);
      setIsShezmuApproving(false);
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
      setIsTokenApproving(true);
      const tokenDecimal = await getDecimals(
        selectedToken?.address as `0x${string}`
      );
      const approveAmount = parseUnits(
        guardianInfo?.txnFee.toString(),
        tokenDecimal
      );
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
      setError((err as ErrorTypes).message);
      setIsTokenApproving(false);
    }
  };

  const handleGuardianMint = async () => {
    if (
      !guardianAddress ||
      !address ||
      !selectedToken ||
      isMintButtonDisabled ||
      !mintGuardian
    )
      return;
    try {
      setIsMinting(true);
      const txnHash = await mintGuardian(
        address,
        selectedToken.address,
        guardianAmount
      );
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txnHash || "0x",
        timeout: 60_000,
      });
      if (transaction.status === "success") {
        getShezmuBalance(address);
        getGuardianBalance(address);
        getGuardianInfo();
        updateShezmuAllowance();
        updateSelectedTokenAllowance();
        updateGuardianBalance();
      }
      setIsMinting(false);
    } catch (err) {
      console.log(err);
      setIsMinting(false);
      setError((err as Error).message);
    }
  };

  const isMintButtonDisabled =
    selectedToken?.address &&
    (!isConnected ||
      Number(guardianAmount) <= 0 ||
      inputError !== "" ||
      !isTokenApproved ||
      isMinting ||
      !isShezmuApproved ||
      !guardianInfo?.allFeeTokens ||
      guardianInfo?.allFeeTokens.length === 0 ||
      shezmuBalance <= 0 ||
      !shezmuBalance);

  // useEffect functions
  useEffect(() => {
    if (!address) {
      setIsShezmuApproved(true);
      return;
    }
    if (
      guardianInfo?.pricePerGuardian &&
      guardianAmount !== undefined &&
      shezmuAllowance !== undefined
    ) {
      setIsShezmuApproved(
        !(Number(guardianAmount) > 0) ||
        shezmuAllowance >=
        Number(guardianAmount) * guardianInfo?.pricePerGuardian
      );
    }
  }, [
    shezmuAllowance,
    guardianAmount,
    guardianInfo?.pricePerGuardian,
    address,
  ]);

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col sm:flex-row items-start sm:items-center">
          <div className={smallText}>Shezmu balance</div>
          <div className="text-[#F8D044] text-[28px] sm:text-[32px] font-semibold leading-[102%] overflow-hidden">
            {shezmuBalance &&
              shezmuBalance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
              })}{" "}
            <span className="font-[Newsreader] font-normal">Shezmu</span>
          </div>
        </div>
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="flex flex-col lg:flex-row items-start lg:items-center">
            <div className="text-[#A1A1AA] py-2 lg:p-0">
              <div className="leading-[120%] text-xs font-bold w-[130px]">
                Guardian quantity
              </div>
              <div className="leading-[120%] text-[10px]">
                Max {guardianInfo?.mintLimit} per TXN
              </div>
            </div>
            <div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-6">
                <input
                  placeholder="0"
                  className={`text-[32px] font-semibold leading-[102%] ${inputError ? "border border-red-600" : "border-none"
                    } outline-none rounded-2xl bg-[#18181B] text-[#F8D044] text-center py-1 w-32`}
                  value={guardianAmount}
                  onChange={(e) => handleInputGuardianAmount(e.target.value)}
                />
                <div className="text-xs font-light hidden lg:block text-white">
                  <div className="leading-[120%]">
                    1 Guardian = {guardianInfo?.pricePerGuardian} Shezmu
                  </div>
                  <div className="leading-[120%]">
                    Guardian rewards{" "}
                    {(guardianInfo?.rewardPerDay).toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                      minimumFractionDigits: 0,
                    })}{" "}
                    Shezmu per day
                  </div>
                </div>
              </div>
              {inputError !== "" && (
                <div className="text-xs text-red-600">{inputError}</div>
              )}
            </div>
          </div>
          <div className="text-xs font-light block lg:hidden mt-2 lg:mt-0 text-white">
            <div className="leading-[120%]">
              1 Guardian = {guardianInfo?.pricePerGuardian} Shezmu
            </div>
            <div className="leading-[120%]">
              Guardian rewards{" "}
              {(guardianInfo?.rewardPerDay).toLocaleString(undefined, {
                maximumFractionDigits: 6,
                minimumFractionDigits: 0,
              })}{" "}
              Shezmu per day
            </div>
            <div className="leading-[120%] font-bold mt-2 lg:mt-0 text-transparent bg-clip-text bg-gradient-to-b from-[#0084FE] to-[#6FCEEC]">
              Total Shezmu : {guardianAmount || 0} *{" "}
              {guardianInfo?.pricePerGuardian} ={" "}
              {Number(guardianAmount) * guardianInfo?.pricePerGuardian}
            </div>
          </div>
          <div className="flex items-center jsutify-end gap-6 w-full lg:w-auto">
            <div className="leading-[120%] font-bold text-xs hidden lg:block text-end text-transparent bg-clip-text bg-gradient-to-b from-[#0084FE] to-[#6FCEEC]">
              Total Shezmu : {guardianAmount || 0} *{" "}
              {guardianInfo?.pricePerGuardian} ={" "}
              {Number(guardianAmount) * guardianInfo?.pricePerGuardian}
            </div>
            <ApproveBtn
              isTokenApproved={isShezmuApproved}
              className={`mt-2 lg:mt-0 w-full`}
              onClick={handleShezmuApprove}
              isApproving={isShezmuApproving}
            />
          </div>
        </div>
        <div className="w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className={smallText}>Mint fee</div>
            <div className="text-white text-[28px] sm:text-[32px] font-semibold leading-[102%]">
              $
              {guardianInfo?.txnFee?.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className={approveSection}>
            <TokenSelect
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              tokens={guardianInfo?.allFeeTokens}
            />
            <ApproveBtn
              className={`mt-2 sm:mt-0`}
              isTokenApproved={isTokenApproved}
              isApproving={isTokenApproving}
              onClick={handleSelectedTokenApprove}
            />
          </div>
        </div>
      </div>
      {isConnected ? (
        <button
          disabled={isMintButtonDisabled}
          className="disabled:opacity-50 bg-[#F8D044] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%] mt-2 sm:mt-0"
          onClick={() => handleGuardianMint()}
        >
          {isMinting ? "Minting..." : "Mint"}
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
