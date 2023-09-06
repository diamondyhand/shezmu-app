/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
// ** web3 imports
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { goerli } from "viem/chains";
// ** utils & config imports
import { getERC20TokenContract } from "@/utils/contractHelper";
import { ZERO_ADDRESS } from "@/config/constants/network";

const useERC20Token = (address: string) => {
  const tokenContract = getERC20TokenContract(address);
  const tokenAddress = tokenContract?.address;
  const { address: account } = useAccount();
  const [decimals, setDecimals] = useState(18);
  const [userBalance, setUserBalance] = useState(0);

  const getBalance = useCallback(
    async (account: string) => {
      if (!tokenContract || !account) return 0;
      const wei = await tokenContract.read.balanceOf([
        account as `0x${string}`,
      ]);
      return Number(formatUnits(wei as bigint, decimals));
    },
    [tokenContract, decimals]
  );

  const getUserBalance = async () => {
    if (!tokenContract || !account) return;
    const wei = await tokenContract.read.balanceOf([account as `0x${string}`]);
    setUserBalance(Number(formatUnits(wei as bigint, decimals)));
  };

  const getAllowance = useCallback(
    async (owner: string, spender: string) => {
      if (!tokenContract || !spender || !owner) return 0;
      const wei = await tokenContract.read.allowance([
        owner as `0x${string}`,
        spender as `0x${string}`,
      ]);
      return Number(formatUnits(wei as bigint, decimals));
    },
    [tokenContract, decimals]
  );

  const approve = useCallback(
    async (spender: string, amount: bigint) => {
      if (!tokenContract || !account) return null;
      const txnHash = await (tokenContract as any).write.approve([spender as `0x${string}`, amount], { account });
      return txnHash;
    },
    [tokenContract]
  );

  useEffect(() => {
    if (tokenAddress != ZERO_ADDRESS && tokenContract) {
      (async () => {
        const decimals = await tokenContract.read.decimals();
        setDecimals(Number(decimals));
      })();
    }
  }, [tokenAddress]);

  return {
    decimals,
    userBalance,
    getUserBalance,
    getBalance,
    getAllowance,
    approve,
  };
};

export default useERC20Token;
