import { getContract } from "viem";
import { getPublicClient, getWalletClient } from "./viemHelper";
import {
  getTokenSaleAddress,
  getShezmuAddress,
  getGuardianAddress,
} from "./addressHelper";
import TokenSaleABI from "@/config/abi/PublicSale.json";
import ShezmuABI from "@/config/abi/Shezmu.json";
import GuardianABI from "@/config/abi/Guardian.json";
import { erc20ABI } from "wagmi";

export const getTokenSaleContract = () => {
  const walletClient = getWalletClient();
  if (walletClient) {
    return getContract({
      address: getTokenSaleAddress(),
      abi: TokenSaleABI,
      publicClient: getPublicClient(),
      walletClient: walletClient,
    });
  }
};

export const getShezmuContract = () => {
  const walletClient = getWalletClient();
  if (walletClient) {
    return getContract({
      address: getShezmuAddress(),
      abi: ShezmuABI,
      publicClient: getPublicClient(),
      walletClient: walletClient,
    });
  }
};

export const getGuardianContract = () => {
  const walletClient = getWalletClient();
  if (walletClient) {
    return getContract({
      address: getGuardianAddress(),
      abi: GuardianABI,
      publicClient: getPublicClient(),
      walletClient: walletClient,
    });
  }
};

export const getERC20TokenContract = (address: string) => {
  const walletClient = getWalletClient();
  if (walletClient) {
    return getContract({
      address: address as `0x${string}`,
      abi: erc20ABI,
      publicClient: getPublicClient(),
      walletClient: walletClient,
    });
  }
};
