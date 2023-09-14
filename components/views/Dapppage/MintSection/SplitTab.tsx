// ** react imports
import { useState, useCallback, useEffect } from "react";
// ** wagmi imports
import { useAccount } from "wagmi";
// ** web3 module imports
import { useWeb3Modal } from "@web3modal/react";
import Craftsman from "@/components/widgets/SVG/Craftsman";
import Scribe from "@/components/widgets/SVG/Scribe";
import Priest from "@/components/widgets/SVG/Priest";
import Noble from "@/components/widgets/SVG/Noble";
import Viziers from "@/components/widgets/SVG/Viziers";
// import Pharaoh from "@/components/widgets/SVG/Pharaoh";
import GuardianImage from "@/components/widgets/Guardian/GuardianImage";

// default css
const smallGurdianText = "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-2";

const smallText =
  "text-xs font-bold leading-[120%] text-[#A1A1AA] w-[130px] pr-14";

const paragraphBg =
  "w-full bg-[#27272A] p-6 rounded-[40px] flex flex-col gap-4";

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
    value: 50
  },
  {
    name: 'Pharaoh',
    amount: 0,
  }
];
export default function SplitTab({ shezmuAmount, guardianBal, craftsmanBal, scribeBal, priestBal, nobleBal, vizierBal, pharaohBal  }: SplitTabProps) {
  const SIZES = [1, 5, 10, 25, 50, 100];
  const [guardianData, setGuardianData] = useState(defaultGuardianData);
  // state
  const [isSending, setIsSending] = useState(false);
  const [addressInputError, setAddressInputError] = useState("");
  const [inputError, setInputError] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [toAmount, setToAmount] = useState("0");

  // hooks
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  // callbacks
  const handleSend = useCallback(() => {}, []);
  const validateAddress = (address: string) => {
    // Ethereum address regex pattern
    const addressRegex = /^0x[0-9a-fA-F]{40}$/;
    return addressRegex.test(address);
  };

  const handleInputToAddr = useCallback((addr: string) => {
    if (!validateAddress(addr)) {
      setAddressInputError(
        `Wallet invalid.`
      );
    } else {
      setAddressInputError("");
    }

    setToAddr(addr);
  }, []);

  const handleInputToAmount = useCallback((amount: string) => {
    if (Number(amount) > guardianBal) {
      setInputError(
        `You can't split Guardian than ${guardianBal}.`
      );
    } else {
      setInputError("");
    }
    setToAmount(amount);
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
    let Datas = guardianData || [];
    for (var i = 0; i < SIZES.length; i++) {
      var index = SIZES.length - i - 1;
      Datas[index].amount = Math.floor((totalAmount / SIZES[index]));
      totalAmount = totalAmount % SIZES[index];
    }
    setGuardianData(Datas)
  }, [])

  useEffect(() => {
    updateGuardianList(Math.floor(Number(toAmount)));
  }, [toAmount])

  const isSendBtnDisabled = !isConnected;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start">
          <div className={`${smallGurdianText} w-24 pr-0`}>Your guardians</div>
          <div className="flex flex-wrap justify-between sm:justify-normal gap-2 sm:gap-3 w-full sm:pl-[28px]">
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
            <div className="text-[#F8D044] text-[28px] sm:text-[32px] font-semibold leading-[102%]">
              {guardianBal && guardianBal}{" "}
              <span className="font-[Newsreader] font-normal">Guardians</span>
            </div>
          </div>
        </div>
        <div className={paragraphBg}>
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center">
            <div className={smallText}>To (which address)</div>
            <div className="w-full lg:w-6/6 flex flex-col">
              <input
                placeholder="0x000..."
                className={`text-[24px] ${
                  inputError ? "border border-red-600" : "border-none"
                } outline-none rounded-2xl bg-[#18181B] text-white px-4 py-1 w-full`}
                value={toAddr}
                onChange={(e) => handleInputToAddr(e.target.value)}
              />
              {inputError !== "" && (
                <div className="text-xs text-red-600">{inputError}</div>
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
            <div className="flex flex-row items-start gap-12 text-lg">
              <div className="flex flex-row items-center">
                <div>Pharaoh:&nbsp;</div>
                <div className="text-2xl">0.00</div>
              </div>
              <div className="flex flex-row items-center">
                <div>Vizier:&nbsp;</div>
                <div className="text-2xl">0.00</div>
              </div>
              <div className="flex flex-row items-center">
                <div>Vizier:&nbsp;</div>
                <div className="text-2xl">0.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isConnected ? (
        <button
          disabled={isSendBtnDisabled}
          className="disabled:opacity-50 bg-[#2C91FE] h-[50px] sm:h-[73px] w-full rounded-xl text-black text-xl font-bold leading-[120%]"
          onClick={() => handleSend()}
        >
          {isSending ? "Sending..." : "Send"}
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
