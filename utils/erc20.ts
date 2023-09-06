import { erc20ABI } from "wagmi";
import { getPublicClient } from "./viemHelper";
import { formatUnits } from "viem";
import { TokenListTypes } from "@/components/widgets/Constants/type";

export const getDecimals = async (address: string) => {
  const publicClient = getPublicClient();
  const decimals = await publicClient.readContract({
    address: address as `0x${string}`,
    abi: erc20ABI,
    functionName: "decimals",
  });
  return Number(decimals);
};

export const getAllowance = async (
  address: string,
  owner: string,
  spender: string
) => {
  const publicClient = getPublicClient();
  const decimals = await publicClient.readContract({
    address: address as `0x${string}`,
    abi: erc20ABI,
    functionName: "allowance",
    args: [owner as `0x${string}`, spender as `0x${string}`],
  });
  return Number(decimals);
};

export const getUserTokensInfo = async (
  contracts: string[],
  account: string | undefined
) => {
  const publicClient = getPublicClient();
  const tokenNames = await publicClient.multicall({
    contracts: contracts.map((address) => ({
      address: address as `0x${string}`,
      abi: erc20ABI,
      functionName: "symbol",
    })),
  });
  const tokenDecimals = await publicClient.multicall({
    contracts: contracts.map((address) => ({
      address: address as `0x${string}`,
      abi: erc20ABI,
      functionName: "decimals",
    })),
  });
  const tokenBalances = account ? await publicClient.multicall({
    contracts: contracts.map((address) => ({
      address: address as `0x${string}`,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [account],
    })),
  }) : contracts.map((address, index) => ({result: 0}));
  return contracts.map((address, index) => ({
    index: index + 1,
    name: tokenNames[index].result,
    address,
    balance: Number(
      formatUnits(
        tokenBalances[index].result as bigint,
        tokenDecimals[index].result || 18
      )
    ),
  })) as TokenListTypes[];
};

export const getChainId = async () => {
  const publicClient = getPublicClient();
  const chainId = await publicClient.getChainId();
  return chainId
}