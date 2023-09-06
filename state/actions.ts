import { formatUnits } from "viem";
import { getERC20TokenContract, getGuardianContract } from "@/utils/contractHelper";
import { getShezmuAddress } from "@/utils/addressHelper";
import { getDecimals } from "@/utils/erc20";

const guardianContract = getGuardianContract();
const shezmuAddress = getShezmuAddress();
const tokenContract = getERC20TokenContract(shezmuAddress);

console.log(tokenContract)

export const fetchGuardianInfo = async () => {
    if (!tokenContract) return;
    const shezmuDecimals = await tokenContract.read.decimals();
    if (!guardianContract) return;
    const [pricePerGuardian, mintLimit, rewardRate, txnFee, allFeeTokens, claimFee] = await Promise.all([
        guardianContract.read.pricePerGuardian(),
        guardianContract.read.mintLimit(),
        guardianContract.read.rewardRate(),
        guardianContract.read.txnFee(),
        guardianContract.read.allFeeTokens(),
        guardianContract.read.claimFee(),
    ]);
    return {
        pricePerGuardian: Number(formatUnits(pricePerGuardian as bigint, shezmuDecimals)),
        mintLimit: Number(mintLimit),
        rewardPerDay: Number(formatUnits((rewardRate as BigInt[])[0] as bigint, shezmuDecimals)) * 24 * 3600,
        txnFee: Number(formatUnits(txnFee as bigint, shezmuDecimals)),
        allFeeTokens: allFeeTokens as any,
        claimFee: Number(claimFee) / 100
    };
};

export const fetchGuardianBalance = async (account: `0x${string}`) => {
    if (!guardianContract || !account) return 0;
    const totalBalance = await guardianContract.read.totalBalanceOf([account]);
    return Number(totalBalance);
}

export const fetchPendingReward = async (account: `0x${string}`) => {
    if (!tokenContract) return;
    const shezmuDecimals = await tokenContract.read.decimals();
    if (!guardianContract || !account) return [0, 0];
    const result: any = await guardianContract.read.pendingReward([account]);

    const usdcAddress: any = await guardianContract.read.USDC();
    const usdcDecimals = await getDecimals(usdcAddress);
    return [
        Number(formatUnits(result[0] as bigint, shezmuDecimals)),
        Number(formatUnits(result[1] as bigint, usdcDecimals)),
    ]
}

export const fetchShezmuBalance = async (account: `0x${string}`) => {
    if (!tokenContract || !account) return;
    const wei = await tokenContract.read.balanceOf([account as `0x${string}`]);
    const decimals = await tokenContract.read.decimals();
    return Number(formatUnits(wei as bigint, decimals));
}