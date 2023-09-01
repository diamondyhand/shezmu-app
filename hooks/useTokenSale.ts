/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
// ** web3 imports
import { formatEther, formatUnits, parseEther } from "viem";
import { useAccount } from "wagmi";
// ** utils & hooks imports
import { getTokenSaleContract } from "@/utils/contractHelper";
import { getShezmuAddress } from "@/utils/addressHelper";
import useERC20Token from "./useERC20Token";

export interface TokenSaleInfo {
  shezmuAmount: number;
  totalShezmuAmount: number;
  startTime: number;
  endTime: number;
  totalEthAmount: number;
}

const useTokenSale = () => {
  const { address: account } = useAccount();
  const tokenSaleContract = getTokenSaleContract();
  const tokenSaleAddress = tokenSaleContract?.address;
  const [tokenSaleInfo, setTokenSaleInfo] = useState<TokenSaleInfo>({
    shezmuAmount: 0,
    totalShezmuAmount: 0,
    startTime: 0,
    endTime: 0,
    totalEthAmount: 0
  });

  const [mintableETHLimit, setMintableETHLimit] = useState<number>(0);
  const [userPurchasedETH, setUserPurchasedETH] = useState<number>(0);
  const { decimals: shezmuDecimals } = useERC20Token(getShezmuAddress());

  const fetchTokenSaleInfo = useCallback(async () => {
    if (!tokenSaleContract) return;
    const [
      shezmuAmount,
      totalShezmuAmount,
      startTime,
      endTime,
      totalEthAmount,
    ] = await Promise.all([
      tokenSaleContract.read.shezmuAmount(),
      tokenSaleContract.read.totalShezmuAmount(),
      tokenSaleContract.read.startTimestamp(),
      tokenSaleContract.read.endTimestamp(),
      tokenSaleContract.read.totalEthAmount(),
    ]);

    setTokenSaleInfo({
      shezmuAmount: Number(formatUnits(shezmuAmount as bigint, shezmuDecimals)),
      totalShezmuAmount: Number(
        formatUnits(totalShezmuAmount as bigint, shezmuDecimals)
      ),
      startTime: Number(startTime),
      endTime: Number(endTime),
      totalEthAmount: Number(formatEther(totalEthAmount as bigint)),
    });
  }, [shezmuDecimals]);

  const getMintableETHLimit = useCallback(async () => {
    if (!tokenSaleContract || !account) return 0;
    const mintableETHLimit = await tokenSaleContract.read.maxEth([account]);
    return setMintableETHLimit(Number(formatEther(mintableETHLimit as bigint)));
  }, [tokenSaleContract, account])

  const getUserPurchasedETH = useCallback(async () => {
    if (!tokenSaleContract || !account) return 0;
    const userPurchasedETH = await tokenSaleContract.read.userEth([account]);
    return setUserPurchasedETH(Number(formatEther(userPurchasedETH as bigint)));
  }, [tokenSaleContract, account])

  const buy = useCallback(
    async (ethAmount: string) => {
      if (!tokenSaleContract) return null;
      // const { result } = await tokenSaleContract.simulate.buy({
      //   account,
      //   value: parseEther(ethAmount),
      // });
      // if (result) {
      const txnHash = await tokenSaleContract.write.buy([], {
        account,
        value: parseEther(ethAmount),
      });
      return txnHash;
      // }
      // return null;
    },
    [tokenSaleContract]
  );

  useEffect(() => {
    if (tokenSaleAddress) {
      (async () => {
        await fetchTokenSaleInfo();
      })();
    }
  }, [tokenSaleAddress]);

  return {
    tokenSaleInfo,
    fetchTokenSaleInfo,
    mintableETHLimit,
    getMintableETHLimit,
    userPurchasedETH,
    getUserPurchasedETH,
    buy,
  };
};

export default useTokenSale;
