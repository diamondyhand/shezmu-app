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
  const { decimals: shezmuDecimals } = useERC20Token(getShezmuAddress());

  const getBalance = useCallback(
    async (id: GuardianID) => {
      if (!guardianContract || !account) return 0;
      const balance = await guardianContract.read.balanceOf([account, id]);
      return Number(balance);
    },
    [guardianContract, account]
  );

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
      const txnHash = await guardianContract.write.mint(
        [to, feeToken, amount],
        { account }
      );
      return txnHash;
    },
    [guardianContract, account]
  );

  const compound = useCallback(
    async (to: string, feeToken: string, amount: bigint) => {
      if (!guardianContract || !account) return null;
      const txnHash = await guardianContract.write.compound(
        [to, feeToken, amount],
        { account }
      );
      return txnHash;
    },
    [guardianContract, account]
  );

  const claim = useCallback(async () => {
    if (!guardianContract || !account) return null;
    const txnHash = await guardianContract.write.claim([], { account });
    return txnHash;
  }, [guardianContract, account]);

  return {
    getBalance,
    getTokenAllowance,
    mint,
    compound,
    claim,
  };
};

export default useGuardian;
