// ** react imports
import { useState, useCallback, useEffect } from "react";
// ** wagmi imports
import { useAccount } from "wagmi";
// ** web3 module imports
import { useWeb3Modal } from "@web3modal/react";
import { getGuardianAddress, getShezmuAddress } from "@/utils/addressHelper";
import GuardianImage from "@/components/widgets/Guardian/GuardianImage";
import { useGuardianStore, usePendingStore } from "@/state/state";
import useGuardian from "@/hooks/useGuardian";
import { getPublicClient } from "@/utils/viemHelper";

// default css
const smallGurdianText = "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-2";

const smallText =
  "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-14";

const paragraphBg =
  "w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col gap-4";
  const guardianAddress = getGuardianAddress();

interface SplitTabProps {
    shezmuAmount: number;
    guardianBal: number;
    craftsmanBal: number;
    scribeBal: number;
    priestBal: number;
    nobleBal: number;
    vizierBal: number;
    pharaohBal: number;
}
const defaultGuardianData = [
  {
    name: 'Craftsman',
    amount: 0,
  },
  {
    name: 'Scribe',
    amount: 0,
  },
  {
    name: 'Priest',
    amount: 0,
  },
  {
    name: 'Noble',
    amount: 0,
  },
  {
    name: 'Vizier',
    amount: 0,
  },
  {
    name: 'Pharaoh',
    amount: 0,
  }
];
export default function SplitTab({ shezmuAmount, guardianBal }: SplitTabProps) {
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

  const [guardianList, setGuardianList] = useState([0, 0, 0, 0, 0, 0]);
  // state
  const [isSending, setIsSending] = useState(false);
  const [isSplitting, setIsSplitting] = usePendingStore((state) => [state.isSplitting, state.setIsSplitting])
  const [isDisabledSplit, setIsDisabledSplit] = useState(true);
  const [addressInputError, setAddressInputError] = useState("");
  const [inputError, setInputError] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [toAmount, setToAmount] = useState("");
  const publicClient = getPublicClient();

  const [craftsmanBal, setCraftsmanBal] = useState(0);
  const [scribeBal, setScribeBal] = useState(0);

  const [priestBal, setPriestBal] = useState(0);
  const [nobleBal, setNobleBal] = useState(0);
  const [vizierBal, setVizierBal] = useState(0);
  const [pharaohBal, setPharaohBal] = useState(0);

  // hooks
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const { split } = useGuardian();


  // callbacks
  const validateAddress = (address: string) => {
    // Ethereum address regex pattern
    const addressRegex = /^0x[0-9a-fA-F]{40}$/;
    return addressRegex.test(address);
  };

  const handleInputToAddr = useCallback((addr: string) => {
    console.log("validateAddress(addr) ", addr, validateAddress(addr));
    if(addr.length > 42) {
      setAddressInputError(
        `Invalid address.`
      );
    } else if(addr.length == 42 && !validateAddress(addr)) {
      setAddressInputError(
        `Invalid address.`
      );
      
    } else {
      setAddressInputError("");
    }

    setToAddr(addr);
  }, []);

  const handleInputToAmount = useCallback((amount: string) => {
    const regex = /^(\d+|0)?$/;
    if (regex.test(amount)) {
      setToAmount(amount);
      if (
        Number(amount) > guardianBal
      ) {
        setInputError(
          `Exceeds your guardians.`
        );
        } else {
        setInputError("");
      }
    }
  }, []);

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

  const updateTotalGuardianList = useCallback((amount: number) => {
    // 1 Guardian: Craftsman
    // 5 Guardian: Scribe
    // 10 Guardian: High Priest
    // 25 Guardian: Nobles
    // 50 Guardians: Viziers
    // 100 Guardian: Pharaoh
    let newtotalAmount = amount;
    const SIZES = [1, 5, 10, 25, 50, 100];
    let newDatas = defaultGuardianData || [];
    for (var i = 0; i < SIZES.length; i++) {
      var index = SIZES.length - i - 1;
      newDatas[index].amount = Math.floor((newtotalAmount / SIZES[index]));
      newtotalAmount = newtotalAmount % SIZES[index];
    }
    setCraftsmanBal(Number(newDatas[0].amount))
    setScribeBal(Number(newDatas[1].amount))
    setPriestBal(Number(newDatas[2].amount))
    setNobleBal(Number(newDatas[3].amount))
    setVizierBal(Number(newDatas[4].amount))
    setPharaohBal(Number(newDatas[5].amount))
  }, [])

  
  const handleSplit = async (to: string, amount: string) => {
    if (
      !guardianAddress ||
      !address ||
      isSplitting
    )
      return;
    try {
      setIsSplitting(true);
      const txnHash = await split(to, BigInt(amount));
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txnHash || "0x",
        timeout: 60_000,
      });
      if (transaction.status === "success") {
        getGuardianBalance(address);
        updateTotalGuardianList(guardianBal);
        getGuardianInfo();
      }
      setIsSplitting(false);
    } catch (err) {
      setIsSplitting(false);
    }
  };

  useEffect(() => {
    updateTotalGuardianList(guardianBal);
  })

  useEffect(() => {
    if (!validateAddress(toAddr) || Number(toAmount) == 0 || Number(toAmount) >= guardianBal || !isConnected) {
      setIsDisabledSplit(true);
    } else {
      setIsDisabledSplit(false)
    }
  }, [toAddr, toAmount, guardianBal])

  useEffect(() => {
    updateGuardianList(Math.floor(Number(toAmount)));
  }, [toAmount])

  // const isSendBtnDisabled = !isConnected;
  // console.log('isToAddress is ', isToAddress, isToAmount);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start">
          <div className={`${smallGurdianText} w-24 pr-0 pl-[10px] sm:pl-0`}>Your guardians</div>
          <div className="flex flex-wrap sm:justify-normal gap-0 sm:gap-3 sm:w-full sm:pl-[28px] justify-between">
            {craftsmanBal > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='craftsmen' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Craftsman: {craftsmanBal}
                </div>
              </div>
            )}
            {scribeBal > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='scribe' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Scribe: {scribeBal}
                </div>
              </div>
            )}
            {priestBal > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='priest' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Priest: {priestBal}
                </div>
              </div>
            )}
            {nobleBal > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='noble' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Nobles: {nobleBal}
                </div>
              </div>
            )}
            {vizierBal > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='vizier' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Viziers: {vizierBal}
                </div>
              </div>
            )}
            {pharaohBal > 0 && (
              <div className="flex flex-col items-center justify-between">
                <div className="scale-75">
                  <GuardianImage name='pharaoh' />
                </div>
                <div className="text-[#FAFAFA] font-light leading-[120%] text-sm sm:text-base text-center">
                  Pharaoh: {pharaohBal}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={paragraphBg}>
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center">
            <div className={smallText}>Your total guardians</div>
            <div className="text-[#F8D044] text-[28px] sm:text-[32px] font-semibold leading-[102%] sm:mt-0 mt-1">
              {guardianBal && guardianBal}{" "}
              <span className="font-[Newsreader] font-normal">Guardians</span>
            </div>
          </div>
        </div>
        <div className={paragraphBg}>
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center">
            <div className={smallText}>To (which address)</div>
            <div className="w-full lg:w-6/6 flex flex-col sm:mt-0 mt-1 sm:ml-[8px]">
              <input
                placeholder="0x000..."
                className={`text-[24px] ${
                  addressInputError ? "border border-red-600" : "border-none"
                } outline-none rounded-2xl bg-[#18181B] text-white px-4 py-1 w-full`}
                value={toAddr}
                onChange={(e) => handleInputToAddr(e.target.value)}
              />
              {addressInputError !== "" && (
                <div className="text-xs text-red-600">{addressInputError}</div>
              )}
            </div>
          </div>
        </div>
        <div className={paragraphBg}>
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center">
            <div className={smallText}>Amount of guardians</div>
            <div className="flex flex-col">
            <input
                placeholder="0"
                className={`text-[28px] sm:text-[32px] font-semibold ${
                  inputError ? "border border-red-600" : "border-none"
                } leading-[102%] outline-none rounded-2xl bg-[#18181B] text-[#F8D044] text-center px-6 py-1 w-32 mt-2 sm:mt-0`}
                value={toAmount}
                onChange={(e) => handleInputToAmount(e.target.value)}
              />
              {inputError !== "" && (
                <div className="text-xs text-red-600">{inputError}</div>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center text-white">
            <div className={smallText}>Guardians to send</div>
            <div className="grid sm:flex flex-row items-start gap-5 text-lg">     
            
   
            {guardianList[0] > 0 && (
              <div className="flex flex-row items-center">
                <div>Craftsman:&nbsp;</div>
                <div className="text-2xl pl-[10px]">{guardianList[0]}</div>
              </div>
            )}
            {guardianList[1] > 0 && (
              <div className="flex flex-row items-center">
                <div>Scribe:&nbsp;</div>
                <div className="text-2xl pl-[10px]">{guardianList[1]}</div>
              </div>
            )}
            {guardianList[2] > 0 && (
              <div className="flex flex-row items-center">
                <div>Priest:&nbsp;</div>
                <div className="text-2xl pl-[10px]">{guardianList[2]}</div>
              </div>
            )}
            {guardianList[3] > 0 && (
              <div className="flex flex-row items-center">
                <div>Nobles:&nbsp;</div>
                <div className="text-2xl pl-[10px]">{guardianList[3]}</div>
              </div>
            )}
            {guardianList[4] > 0 && (
              <div className="flex flex-row items-center">
                <div>Viziers:&nbsp;</div>
                <div className="text-2xl pl-[10px]">{guardianList[4]}</div>
              </div>
            )}
            {guardianList[5] > 0 && (
              <div className="flex flex-row items-center">
                <div>Pharaoh:&nbsp;</div>
                <div className="text-2xl pl-[10px]">{guardianList[5]}</div>
              </div>
            )}


            </div>
          </div>
        </div>
      </div>
      {isConnected ? (
        <button
          disabled={isDisabledSplit}
          className="disabled:opacity-50 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]"
          onClick={() => handleSplit(toAddr, toAmount)}
        >
          {isSplitting ? "Sending..." : "Send"}
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
