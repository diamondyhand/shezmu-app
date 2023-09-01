import { useCallback, useEffect, useState } from "react";
import { useAccount, useFeeData } from "wagmi";
import { formatEther } from "viem";

import { getPublicClient } from "@/utils/viemHelper";

const useNetwork = () => {
  const { data: gasFeeData } = useFeeData();
  const { address: account } = useAccount();
  const [ethBalance, setETHBalance] = useState<number>(0);

  const estimateGas = useCallback(
    async (
      contract: string,
      abi: any,
      method: string,
      args: any[],
      value: bigint
    ) => {
      const publicClient = getPublicClient();
      try {
        const estimateGas = await publicClient.estimateContractGas({
          address: contract as `0x${string}`,
          abi,
          functionName: method,
          args,
          value,
          account: account as `0x${string}`,
        });

        const { maxFeePerGas } = gasFeeData as any;
        const gasFee = formatEther(
          (maxFeePerGas ?? BigInt(0)) * (estimateGas + BigInt(100000))
        );
        return Number(gasFee);
      } catch (err) {
        console.log(err);
        return 0;
      }
    },
    [account]
  );

  const getETHBalance = useCallback(async () => {
    const publicClient = getPublicClient();
    const balance = await publicClient.getBalance({
      address: account as `0x${string}`,
    });
    setETHBalance(Number(formatEther(balance)));
  }, [account]);

  useEffect(() => {
    getETHBalance();
  }, [account, getETHBalance]);

  return { estimateGas, ethBalance, getETHBalance };
};

export default useNetwork;
