/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
// ** web3 imports
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
// ** hooks & utils imports
import { getERC20TokenContract, getGuardianContract } from "@/utils/contractHelper";
import { getAllowance, getDecimals } from "@/utils/erc20";
import { getShezmuAddress } from "@/utils/addressHelper";
import useERC20Token from "./useERC20Token";

export interface GuardianInfo {
  pricePerGuardian: number;
  mintLimit: number;
  rewardPerDay: number;
  txnFee: number;
  allFeeTokens: string[];
  claimFee: number;
}

export enum GuardianID {
  Craftsman,
  Scribe,
  Priest,
  Noble,
  Vizier,
  Pharaoh,
}

const useGuardian = () => {
  const guardianContract = getGuardianContract();
  const guardianAddress = guardianContract?.address;
  const { address: account } = useAccount();

  const [guardianInfo, setGuardianInfo] = useState<GuardianInfo>({
    pricePerGuardian: 0,
    mintLimit: 0,
    rewardPerDay: 0,
    txnFee: 0,
    allFeeTokens: [],
    claimFee: 0
  });
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [pendingRewards, setPendingRewards] = useState<number[]>([0, 0]);
  const { decimals: shezmuDecimals } = useERC20Token(getShezmuAddress());

  const fetchGuardianInfo = useCallback(async () => {
    if (!guardianContract) return;
    const [pricePerGuardian, mintLimit, rewardRate, txnFee, allFeeTokens, claimFee] = await Promise.all([
      guardianContract.read.pricePerGuardian(),
      guardianContract.read.mintLimit(),
      guardianContract.read.rewardRate(),
      guardianContract.read.txnFee(),
      guardianContract.read.allFeeTokens(),
      guardianContract.read.claimFee(),
    ]);
    setGuardianInfo({
      pricePerGuardian: Number(formatUnits(pricePerGuardian as bigint, shezmuDecimals)),
      mintLimit: Number(mintLimit),
      rewardPerDay: Number(formatUnits((rewardRate as BigInt[])[0] as bigint, shezmuDecimals)) * 24 * 3600,
      txnFee: Number(formatUnits(txnFee as bigint, shezmuDecimals)),
      allFeeTokens: allFeeTokens as any,
      claimFee: Number(claimFee) / 100
    });
  }, [shezmuDecimals]);

  const getBalance = useCallback(
    async (id: GuardianID) => {
      if (!guardianContract || !account) return 0;
      const balance = await guardianContract.read.balanceOf([account, id]);
      return Number(balance);
    },
    [guardianContract, account]
  );

  const getTotalBalance = useCallback(async () => {
    if (!guardianContract || !account) return 0;
    const totalBalance = await guardianContract.read.totalBalanceOf([account]);
    setTotalBalance(Number(totalBalance));
  }, [guardianContract, account]);

  const getPendingReward = useCallback(async () => {
    if (!guardianContract || !account) return [0, 0];
    const result: any = await guardianContract.read.pendingReward([account]);

    const usdcAddress: any = await guardianContract.read.USDC();
    const usdcDecimals = await getDecimals(usdcAddress);
    setPendingRewards([
      Number(formatUnits(result[0] as bigint, shezmuDecimals)),
      Number(formatUnits(result[1] as bigint, usdcDecimals)),
    ]);
  }, [guardianContract]);

  const getTokenAllowance = useCallback(
    async (address: string) => {
      if (!address || !account || !guardianAddress) return 0;
      const tokenContract = getERC20TokenContract(address);
      const decimals = await tokenContract?.read.decimals();
      const allowance = await getAllowance(address, account, guardianAddress)
      const tokenAllowance = allowance / 10 ** (decimals as number)
      return tokenAllowance;
    },
    [account, guardianAddress]
  );

  const mint = useCallback(
    async (to: string, feeToken: string, amount: string) => {
      if (!guardianContract || !account) return;
      // const { result } = await guardianContract.simulate.mint(
      //   [to, feeToken, BigInt(amount)],
      //   { account }
      // );
      // if (result) {
      const txnHash = await guardianContract.write.mint(
        [to, feeToken, amount],
        { account }
      );
      return txnHash;
      // }
      // return null;
    },
    [guardianContract, account]
  );

  const compound = useCallback(
    async (to: string, feeToken: string, amount: bigint) => {
      if (!guardianContract || !account) return null;
      // const { result } = await guardianContract.simulate.compound(
      //   [to, feeToken, amount],
      //   { account }
      // );
      // if (result) {
      const txnHash = await guardianContract.write.compound(
        [to, feeToken, amount],
        { account }
      );
      return txnHash;
      // }
      // return null;
    },
    [guardianContract, account]
  );

  const claim = useCallback(async () => {
    if (!guardianContract || !account) return null;
    // const { result } = await guardianContract.simulate.claim([], { account });
    // if (result) {
    const txnHash = await guardianContract.write.claim([], { account });
    return txnHash;
    // }
    // return null;
  }, [guardianContract, account]);

  useEffect(() => {
    if (guardianAddress) {
      (async () => {
        await fetchGuardianInfo();
      })();
    }
  }, [guardianAddress]);

  useEffect(() => {
    if (account && guardianAddress) {
      (async () => {
        await getTotalBalance();
        await getPendingReward();
      })();
    }
  }, [guardianAddress, account]);

  return {
    guardianInfo,
    fetchGuardianInfo,
    getBalance,
    totalBalance,
    getTotalBalance,
    pendingRewards,
    getPendingReward,
    getTokenAllowance,
    mint,
    compound,
    claim,
  };
};

export default useGuardian;
