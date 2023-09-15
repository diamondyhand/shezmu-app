// ** react && next imports imports
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Manrope } from "next/font/google";
// ** style imports
import { MintContainer } from "../style";
// ** mui imports
import { Divider } from "@mui/material";
// ** constants imports
import { TabNameList } from "@/components/widgets/Constants/dapp";
// ** components imports
import MintTab from "./MintTab";
import RewardTab from "./RewardTab";
import Compound from "./Compound";
import { useGuardianStore } from "@/state/state";
import useERC20Token from "@/hooks/useERC20Token";
import { getGuardianAddress, getShezmuAddress } from "@/utils/addressHelper";
import { useAccount } from "wagmi";
import useGuardian, { GuardianID } from "@/hooks/useGuardian";
import { TokenListTypes } from "@/components/widgets/Constants/type";
import SplitTab from "./SplitTab";

// next font imports
const manrope = Manrope({ subsets: ["latin"] });

export default function MintSection() {
  const { address, isConnected } = useAccount();
  const shezmuAddress = getShezmuAddress();
  const [activeTab, setActiveTab] = useState("");
  const [shezmuAllowance, setShezmuAllowance] = useState(0);
  const [selectedTokenAllowance, setSelectedTokenAllowance] =
    useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<
    TokenListTypes | undefined
  >();
  const [shezmuAmount, setShezmuAmount] = useState<number>(0);
  const [craftsmanBal, setCraftsmanBal] = useState<number>(0);
  const [scribeBal, setScribeBal] = useState<number>(0);
  const [priestBal, setPriestBal] = useState<number>(0);
  const [nobleBal, setNobleBal] = useState<number>(0);
  const [vizierBal, setVizierBal] = useState<number>(0);
  const [pharaohBal, setPharaohBal] = useState<number>(0);

  const durationCounterRef = useRef<NodeJS.Timeout | null>(null);

  const [
    guardianInfo,
    guardianBalance,
    pendingRewards,
    shezmuBalance,
    getGuardianInfo,
    getGuardianBalance,
    getPendingReward,
    getShezmuBalance,
    initializeUserInfo,
  ] = useGuardianStore((state) => [
    state.guardianInfo,
    state.guardianBalance,
    state.pendingReward,
    state.shezmuBalance,
    state.getGuardianInfo,
    state.getGuardianBalance,
    state.getPendingReward,
    state.getShezmuBalance,
    state.initializeUserInfo,
  ]);

  const { getTokenAllowance, getBalance } = useGuardian();

  const updateShezmuAllowance = useCallback(async () => {
    if (!address || !shezmuAddress) return;
    const allowance = await getTokenAllowance(shezmuAddress);
    setShezmuAllowance(allowance);
  }, [address, shezmuAddress, getTokenAllowance]);

  const updateSelectedTokenAllowance = useCallback(async () => {
    if (!address || !selectedToken) return;
    const allowance = await getTokenAllowance(selectedToken.address);
    setSelectedTokenAllowance(allowance);
  }, [address, selectedToken, getTokenAllowance]);

  const updateGuardianBalance = async () => {
    setCraftsmanBal(await getBalance(GuardianID.Craftsman));
    setScribeBal(await getBalance(GuardianID.Scribe));
    setPriestBal(await getBalance(GuardianID.Priest));
    setNobleBal(await getBalance(GuardianID.Noble));
    setVizierBal(await getBalance(GuardianID.Vizier));
    setPharaohBal(await getBalance(GuardianID.Pharaoh));
  };

  const initializeGuardianBalance = async () => {
    setCraftsmanBal(0);
    setScribeBal(0);
    setPriestBal(0);
    setNobleBal(0);
    setVizierBal(0);
    setPharaohBal(0);
  }

  useEffect(() => {
    if (TabNameList && TabNameList.length > 0) {
      setActiveTab(TabNameList[0]);
    }
  }, []);

  useEffect(() => {
    getGuardianInfo();
  }, []);

  useEffect(() => {
    if (!address) return;
    getShezmuBalance(address);
    getGuardianBalance(address);
    getPendingReward(address);
    updateShezmuAllowance();
  }, [address]);

  useEffect(() => {
    if (!address || !selectedToken) return;
    updateSelectedTokenAllowance();
  }, [address, selectedToken]);

  useEffect(() => {
    setShezmuAmount(0);
  }, [pendingRewards]);

  useEffect(() => {
    if (!isConnected) {
      initializeUserInfo();
      initializeGuardianBalance();
    }
  }, [isConnected])

  useEffect(() => {
    if (durationCounterRef.current) clearInterval(durationCounterRef.current);
    if (
      guardianInfo?.rewardPerDay &&
      guardianBalance &&
      guardianInfo?.claimFee
    ) {
      const rewardPerSec = guardianInfo?.rewardPerDay / 3600 / 24;
      durationCounterRef.current = setInterval(() => {
        setShezmuAmount(
          (prevState) =>
            prevState +
            (rewardPerSec * guardianBalance * (100 - guardianInfo?.claimFee)) /
              100 /
              4
        );
      }, 250);
    }
  }, [guardianInfo?.rewardPerDay, guardianBalance, guardianInfo?.claimFee]);

  useEffect(() => {
    if (!address) return;
    updateGuardianBalance();
  }, [address])

  return (
    <MintContainer className={manrope.className}>
      <div className="max-w-7xl w-full self-center flex flex-col items-center px-2 sm:px-5 md:px-12 lg:px-16 xl:px-0">
        <div className="max-w-5xl w-full flex flex-col gap-8 px-4 py-8 sm:p-8 lg:p-10 border-4 border-[#F8D044] rounded-[40px] bg-[#18181B] overflow-hidden">
          <div className="flex items-center justify-start gap-2 text-[16px] sm:text-2xl font-bold leading-[120%]">
            {TabNameList.map((item, index) => (
              <div
                key={item}
                className={`flex items-center transition-all cursor-pointer`}
              >
                <div
                  className={`${
                    item === activeTab ? "text-white" : "text-[#52525B]"
                  }`}
                  onClick={() => setActiveTab(item)}
                >
                  {item}
                </div>
                {index < TabNameList.length - 1 && (
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ backgroundColor: "white", marginLeft: "11px" }}
                  />
                )}
              </div>
            ))}
          </div>
          {activeTab === "Mint" && (
            <MintTab
              shezmuBalance={shezmuBalance}
              shezmuAllowance={shezmuAllowance}
              selectedTokenAllowance={selectedTokenAllowance}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              updateShezmuAllowance={updateShezmuAllowance}
              updateSelectedTokenAllowance={updateSelectedTokenAllowance}
              updateGuardianBalance={updateGuardianBalance}
            />
          )}
          {activeTab === "Reward" && (
            <RewardTab
              shezmuAmount={shezmuAmount}
              guardianBal={guardianBalance}
              craftsmanBal={craftsmanBal}
              scribeBal={scribeBal}
              priestBal={priestBal}
              nobleBal={nobleBal}
              vizierBal={vizierBal}
              pharaohBal={pharaohBal}
            />
          )}
          {activeTab === "Compound" && (
            <Compound
              selectedTokenAllowance={selectedTokenAllowance}
              updateSelectedTokenAllowance={updateSelectedTokenAllowance}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              shezmuAmount={shezmuAmount}
              updateGuardianBalance={updateGuardianBalance}
            />
          )}
          {activeTab === 'Split' && (
            <SplitTab               
              shezmuAmount={shezmuAmount}
              guardianBal={guardianBalance}
              craftsmanBal={craftsmanBal}
              scribeBal={scribeBal}
              priestBal={priestBal}
              nobleBal={nobleBal}
              vizierBal={vizierBal}
              pharaohBal={pharaohBal}
            />
          )}
        </div>
      </div>
    </MintContainer>
  );
}
