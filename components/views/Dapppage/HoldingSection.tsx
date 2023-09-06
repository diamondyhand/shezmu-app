"use client";
import { useGuardianStore } from "@/state/state";
// ** style imports
import { RewardContainer } from "./style";
// ** constants imports
import {
  DappRewardConfigForDesktop,
  DappRewardConfigForMobile,
} from "@/components/widgets/Constants/dapp";
import { useMediaQuery } from "@mui/material";

export default function HoldingSection() {
  const [guardianInfo] = useGuardianStore((state) => [state.guardianInfo]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const DappRewardConfig = isMobile
    ? DappRewardConfigForMobile
    : DappRewardConfigForDesktop;
  return (
    <RewardContainer>
      <div className="max-w-7xl w-full self-center z-20 grid items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-20 my-12 md:my-20">
        {DappRewardConfig.map((item) => {
          const RewardSVG = item.svg;
          return (
            <div
              className="flex flex-col items-center text-center"
              key={item.title}
            >
              {RewardSVG()}
              <h6 className="text-white text-xl font-bold mt-2">
                {item.title}
              </h6>
              <div className="text-[#E4E4E7] text-base font-light">
                {item.description.replace(
                  "XXX",
                  (guardianInfo?.rewardPerDay * item.count).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2, minimumFractionDigits: 0 }
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </RewardContainer>
  );
}
