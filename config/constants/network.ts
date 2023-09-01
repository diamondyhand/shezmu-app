import { mainnet } from "viem/chains";

export const CHAIN_ID = process.env.CHAIN_ID || mainnet.id

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';