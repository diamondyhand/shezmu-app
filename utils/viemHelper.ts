import { createPublicClient, createWalletClient, custom, fallback, http, webSocket } from "viem";
import { CHAIN_ID } from "@/config/constants/network";
import { goerli, mainnet } from "viem/chains";

const alchemyWebSocket = webSocket('wss://eth-goerli.g.alchemy.com/v2/ijLpJMMc_01u4hOW_w7KKWZobTzhNKp0')
const infuraHttp = http('https://goerli.infura.io/v3/0e014000f2244b17b6e39bcef7724edc')

export const getPublicClient = () => {
  const publicClient = createPublicClient({
    chain: [goerli, mainnet].find((chain) => chain.id === Number(CHAIN_ID)),
    transport: fallback([http(), alchemyWebSocket, infuraHttp]),
    batch: {
      multicall: true
    }
  });

  return publicClient;
};

export const getWalletClient = () => {
  if (typeof window !== 'undefined') {
    if ((window as any).ethereum) {
      const walletClient = createWalletClient({
        chain: [goerli, mainnet].find((chain) => chain.id === Number(CHAIN_ID)),
        transport: typeof window != 'undefined' ? fallback([custom((window as any).ethereum), alchemyWebSocket, infuraHttp]) : fallback([alchemyWebSocket, infuraHttp]),
      });
      return walletClient;
    }
  }
  return null;
};
