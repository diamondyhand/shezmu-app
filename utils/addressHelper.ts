import addresses from "@/config/constants/contracts";
import { Address } from "@/config/constants/types";
import { mainnet } from "viem/chains";

export const getAddress = (address: Address): `0x${string}` => {
  const chainId = process.env.CHAIN_ID || mainnet.id;
  return (address as any)[chainId];
};

export const getTokenSaleAddress = () => {
  return getAddress(addresses.tokenSale);
};

export const getShezmuAddress = () => {
  return getAddress(addresses.shezmu);
};

export const getGuardianAddress = () => {
  return getAddress(addresses.guardian);
};
