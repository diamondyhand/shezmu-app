// ** UI components imports
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Stack } from "@mui/material";
// ** next && react imports
import { Manrope } from "next/font/google";
import {
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
    useRef,
    useMemo,
} from "react";
// ** components imports
import InfoText from "./InfoText";
import AmountInput from "./AmountInput";
import ProgressBar from "../../ProgressBar";
import ShezmuInput from "./ShezmuInput";
// ** web3 imports
import { useAccount } from "wagmi";
import { parseEther } from "viem";
// ** hooks & utils imports
import { getTokenSaleAddress } from "@/utils/addressHelper";
import { max, min } from "@/utils/number";
import { currentTime, formatDuration } from "@/utils/time";
import { getPublicClient } from "@/utils/viemHelper";
import useTokenSale from "@/hooks/useTokenSale";
import useNetwork from "@/hooks/useNetwork";
// ** ABI imports
import PublicSaleABI from "@/config/abi/PublicSale.json";

const manrope = Manrope({ subsets: ["latin"] });

const textCSS =
    "text-xs text-[#A1A1AA] font-bold leading-[120%] w-full text-center mt-6";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    boxShadow: 24,
    p: 2,
    borderRadius: "24px",
    width: "95%",
    maxWidth: "650px",
};

interface MintGuardianModalProps {
    open: boolean;
    handleClose: (tag: string) => void;
    setAlertOpen: Dispatch<SetStateAction<boolean>>;
    setSnackMsg: Dispatch<SetStateAction<string>>;
}

enum SaleStatus {
    BeforeStart,
    InProgress,
    OverTime,
}

export default function MintGuardianModal({
    open,
    handleClose,
    setAlertOpen,
    setSnackMsg,
}: MintGuardianModalProps) {
    const tokenSaleAddress = getTokenSaleAddress();
    // react hooks
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [ethInputAmount, setEthInputAmount] = useState("");
    const [shezmuInputAmount, setShezmuInputAmount] = useState("");
    const [isBuying, setIsBuying] = useState(false);
    const [maxInputAmountOfETH, setMaxInputAmountOfETH] = useState<number>(0);
    // hooks
    const publicClient = getPublicClient();
    const {
        tokenSaleInfo,
        fetchTokenSaleInfo,
        mintableETHLimit,
        getMintableETHLimit,
        userPurchasedETH,
        getUserPurchasedETH,
        buy,
    } = useTokenSale();
    const { address, isConnected } = useAccount();
    const { estimateGas, getETHBalance, ethBalance } = useNetwork();
    const [dialogDisabled, setDialogDisabled] = useState(false);

    const [publicSaleStatus, setPublicSaleStatus] = useState<SaleStatus>(
        SaleStatus.BeforeStart
    );
    const durationCounterRef = useRef<NodeJS.Timeout | null>(null);
    const isSoldOut = useMemo(() => {
        return (
            tokenSaleInfo?.totalShezmuAmount > 0 &&
            tokenSaleInfo?.shezmuAmount >= tokenSaleInfo?.totalShezmuAmount
        );
    }, [tokenSaleInfo?.shezmuAmount, tokenSaleInfo?.totalShezmuAmount]);

    const handleBuyGuardian = async () => {
        if (!tokenSaleAddress || !address || !buy) return;
        try {
            setIsBuying(true);
            const txnHash = await buy(ethInputAmount.toString());
            const transaction = await publicClient.waitForTransactionReceipt({
                hash: txnHash || "0x",
                timeout: 60_000,
            });
            if (transaction.status === "success") {
                fetchTokenSaleInfo();
                getETHBalance();
                getMintableETHLimit();
            }
            setIsBuying(false);
        } catch (err) {
            console.log(err);
        }
        setIsBuying(false);
    };

    const updateTimer = () => {
        if (tokenSaleInfo?.endTime <= tokenSaleInfo?.startTime) return;
        const now = currentTime();
        const beforeStart = tokenSaleInfo?.startTime > now;
        const inProgress =
            tokenSaleInfo?.endTime > now && tokenSaleInfo?.startTime <= now;
        if (durationCounterRef.current) {
            clearInterval(durationCounterRef.current);
        }
        if (beforeStart) {
            durationCounterRef.current = setInterval(() => {
                setDuration(tokenSaleInfo?.startTime - currentTime());
            }, 1000);
        }
        if (inProgress) {
            durationCounterRef.current = setInterval(() => {
                setDuration(tokenSaleInfo?.endTime - currentTime());
            }, 1000);
        }
        setPublicSaleStatus(
            beforeStart
                ? SaleStatus.BeforeStart
                : inProgress
                    ? SaleStatus.InProgress
                    : SaleStatus.OverTime
        );
    };

    const mintPrice = useMemo(() => {
        if (!(tokenSaleInfo?.totalShezmuAmount > 0)) return 0;
        return tokenSaleInfo?.totalEthAmount / tokenSaleInfo?.totalShezmuAmount;
    }, [tokenSaleInfo?.totalEthAmount, tokenSaleInfo?.totalShezmuAmount]);

    useEffect(() => {
        if (address && isConnected) {
            getETHBalance();
            getMintableETHLimit();
            getUserPurchasedETH();
        }
    }, [address, isConnected, getETHBalance, getMintableETHLimit, getUserPurchasedETH]);

    useEffect(() => {
        if (mintPrice > 0 && mintableETHLimit > 0) {
            (async () => {
                const minInputAmountOfETH = mintPrice * 1; // At least 1 shezmu token should be minted
                const gasFee = await estimateGas(
                    tokenSaleAddress,
                    PublicSaleABI,
                    "buy",
                    [],
                    parseEther(minInputAmountOfETH.toString())
                );
                if (gasFee === 0 || ethBalance < gasFee + minInputAmountOfETH) {
                    setMaxInputAmountOfETH(0);
                } else if (ethBalance - gasFee >= mintableETHLimit) {
                    setMaxInputAmountOfETH(mintableETHLimit);
                } else {
                    setMaxInputAmountOfETH(ethBalance - gasFee);
                }
            })();
        }
    }, [ethBalance, mintableETHLimit, mintPrice]);

    useEffect(() => {
        if (tokenSaleInfo?.totalShezmuAmount && tokenSaleInfo?.shezmuAmount) {
            const progress =
                (tokenSaleInfo?.totalShezmuAmount - tokenSaleInfo?.shezmuAmount) /
                tokenSaleInfo?.totalShezmuAmount;
            setProgress(progress);
        }
    }, [tokenSaleInfo?.totalShezmuAmount, tokenSaleInfo?.shezmuAmount]);

    useEffect(() => {
        if (max(duration, 0) === 0) updateTimer();
        if (publicSaleStatus === SaleStatus.OverTime)
            handleClose("Public sale has been ended");
        setDialogDisabled(
            publicSaleStatus === SaleStatus.BeforeStart ||
            publicSaleStatus === SaleStatus.OverTime ||
            isSoldOut
        );
        return () => { };
    }, [
        tokenSaleInfo?.startTime,
        tokenSaleInfo?.endTime,
        duration,
        publicSaleStatus,
        isSoldOut,
    ]);

    const isBuyBtnDisabled =
        tokenSaleInfo?.totalShezmuAmount <= tokenSaleInfo?.shezmuAmount ||
        !(tokenSaleInfo?.totalEthAmount > 0) ||
        !(tokenSaleInfo?.totalShezmuAmount > 0) ||
        tokenSaleInfo?.shezmuAmount < 0 ||
        isBuying ||
        Number(ethInputAmount) > ethBalance ||
        Number(ethInputAmount) <= 0 ||
        ethBalance <= 0 ||
        Number(shezmuInputAmount) <= 0;

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Stack alignItems="center" className={manrope.className}>
                        <div className="text-black text-2xl font-extrabold mt-6">
                            Public Sale
                        </div>
                        <div className="text-[#A1A1AA] font-semibold my-1">
                            {tokenSaleInfo?.totalShezmuAmount - tokenSaleInfo?.shezmuAmount}{" "}
                            of {tokenSaleInfo?.totalShezmuAmount} Shezmu left
                        </div>
                        <ProgressBar progressPercentage={progress} />
                        <div className="w-full">
                            <InfoText
                                title="Mint Price"
                                info={(
                                    tokenSaleInfo?.totalEthAmount /
                                    tokenSaleInfo?.totalShezmuAmount
                                ).toLocaleString(undefined, {
                                    maximumFractionDigits: 5,
                                    minimumFractionDigits: 0,
                                })}
                            />
                            <AmountInput
                                ethBalance={ethBalance}
                                ethInputAmount={ethInputAmount}
                                setEthInputAmount={setEthInputAmount}
                                setShezmuInputAmount={setShezmuInputAmount}
                                mintPrice={mintPrice}
                                setAlertOpen={setAlertOpen}
                                setSnackMsg={setSnackMsg}
                                dialogDisabled={dialogDisabled}
                                maxInputAmountOfETH={maxInputAmountOfETH}
                                userPurchasedETH={userPurchasedETH}
                            />
                            <ShezmuInput
                                ethBalance={ethBalance}
                                title="Shezmu"
                                info="0.00"
                                shezmuInputAmount={shezmuInputAmount}
                                setShezmuInputAmount={setShezmuInputAmount}
                                setEthInputAmount={setEthInputAmount}
                                mintPrice={mintPrice}
                                setAlertOpen={setAlertOpen}
                                setSnackMsg={setSnackMsg}
                                dialogDisabled={dialogDisabled}
                            />
                        </div>
                        <button
                            disabled={isBuyBtnDisabled}
                            className="h-[40px] sm:h-[73px] mt-6 flex justify-center items-center self-stretch disabled:opacity-50 bg-[#F8D044] rounded-xl text-black font-bold text-base sm:text-xl leading-[120px]"
                            onClick={() => handleBuyGuardian()}
                        >
                            {isBuying ? "Buying..." : "Buy"}
                        </button>
                        {isSoldOut ? (
                            <div className={textCSS}>Sold out</div>
                        ) : publicSaleStatus === SaleStatus.BeforeStart ? (
                            <div className={textCSS}>
                                Public sale starts in {formatDuration(duration)}
                            </div>
                        ) : publicSaleStatus === SaleStatus.InProgress ? (
                            <div className={textCSS}>
                                Public sale ends in {formatDuration(duration)}
                            </div>
                        ) : (
                            <></>
                        )}
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}
