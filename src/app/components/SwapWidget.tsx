'use client'

import { useEffect, useMemo, useState } from "react"
import TokenSelector from "./TokenSelector"
import { AiOutlineSwap } from "react-icons/ai";
import Image from "next/image"
import { useTokenBalance } from "../hooks/useTokenBalance";
import SlippageSelector from "./SlippageSelector";
import { useQuote } from "../hooks/useQuote";
import { useAllowance } from "../hooks/useAllowance";
import { useApprove } from "../hooks/useApprove";
import { Token } from "@/types/swapTypes";
import { toast } from "react-toastify";
import { useSwap } from "../hooks/useSwap";
import { convertToUniToken, toReadableAmount } from "../lib/conversion";
import { FaGasPump } from "react-icons/fa";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useGlobal } from "../providers/GlobalProviders";


const SwapWidget = () => {

    const [fromToken, setFromToken] = useState<Token | null>(null)
    const [toToken, setToToken] = useState<Token | null>(null)
    const [fromAmount, setFromAmount] = useState("")
    const [toAmount, setToAmount] = useState("")
    const [minReceived, setMinReceived] = useState("")
    const [showFromSelector, setShowFromSelector] = useState(false)
    const [showToSelector, setShowToSelector] = useState(false)
    const [slippage, setSlippage] = useState(0.5)
    const [estimatedGas, setEstimatedGas] = useState<string | null>(null);

    const debouncedAmountIn = useDebouncedValue(fromAmount, 400);
    const fromBalance = useTokenBalance(fromToken)
    const toBalance = useTokenBalance(toToken)
    const { getQuote } = useQuote()
    const {allowance, refetchAllowance} = useAllowance(fromToken);
    const { approveToken, approveStatus } = useApprove();
    const { createTrade, executeSwap, swapStatus } = useSwap();
    const { addTransaction } = useGlobal()

    const hasSufficientBalance = parseFloat(fromBalance || "0") >= parseFloat(fromAmount || "0");

    const isApproved: boolean = useMemo(() => {
        if (!fromToken || !debouncedAmountIn) return false;
        return parseFloat(allowance || "0") >= parseFloat(debouncedAmountIn || "0");
    }, [allowance, fromToken, debouncedAmountIn]);

    useEffect(() => {
        const fetchQuote = async () => {
            if (
                !fromToken ||
                !toToken || 
                !debouncedAmountIn ||
                Number(debouncedAmountIn) <= 0
            ) {
                return;
            }

            const uniFromToken = convertToUniToken(fromToken);
            const uniToToken = convertToUniToken(toToken);

            if (!uniFromToken || !uniToToken) return;

            const quote = await getQuote({
                fromToken: uniFromToken,
                toToken: uniToToken,
                amountIn: debouncedAmountIn,
                slippage,
                isApproved,
            });

            if (quote.status === "success") {
                setToAmount(quote.quote);
                setMinReceived(quote.minReceived);
                setEstimatedGas(quote.gasEstimate);
            }

            if (quote.status === "noPool") {
                setToAmount("")
                setMinReceived("");
                setEstimatedGas("");
                toast.error("No direct pool for this swap");
            }

            if (quote.status === "failed") {
                console.error("Something went wrong in fetching quote");
            }
        };

        fetchQuote();
    }, [
        debouncedAmountIn,
        fromToken,
        toToken,
        slippage,
        isApproved,
        getQuote
    ]);


    const handleSwitch = () => {
        const temp = fromToken
        setFromToken(toToken)
        setToToken(temp)
    }

    const hasSufficientAllowance = () => {
        if (!fromToken || !allowance) return false;
        console.log(fromAmount, allowance)
        return parseFloat(allowance) >= parseFloat(fromAmount || "0");
    }

    const handleApprove = async () => {
        if (!fromToken || !fromAmount) return;

        if (!hasSufficientBalance) {
            toast.error("Insufficient token balance for approval");
            return;
        }

        await approveToken({
            token: fromToken,
            amount: fromAmount,
        });

    };

    useEffect(()=>{
        if(approveStatus.isSuccess) refetchAllowance();
    },[approveStatus.isSuccess, refetchAllowance])


    const handleSwap = async () => {
        const fromUniToken = convertToUniToken(fromToken);
        const toUniToken = convertToUniToken(toToken);

        if (!fromUniToken || !toUniToken) {
            toast.error("Missing input or wallet connection");
            return;
        }

        if (!hasSufficientBalance) {
            toast.error("Insufficient token balance to perform this swap");
            return;
        }

        try {
            const trade = await createTrade({
                fromToken: fromUniToken,
                toToken: toUniToken,
                amountIn: fromAmount,
            });

            if (!trade) return;

            const txHash = await executeSwap({
                trade,
                slippagePercent: slippage,
            });

            if (!txHash) return;

            addTransaction({
                txHash,
                timestamp: Date.now(),
                fromSymbol: fromUniToken.symbol!,
                toSymbol: toUniToken.symbol!,
                fromAmount,
                toAmount,
            });
        } catch (error) {
            console.error("Swap error:", error);
            toast.error("Swap execution failed");
        }
    };



    return (
        <div className="w-full max-w-md mx-auto mt-24 bg-[#1a1a1a] p-6 rounded-2xl border border-zinc-700 shadow-lg hover:shadow-pink-600/20 transition">

            <div className="mb-5">
                <div className="text-sm text-zinc-400 mb-1">From</div>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:outline-none"
                    />
                    <button
                        onClick={() => setShowFromSelector(true)}
                        className="flex items-center gap-2 min-w-[100px] max-w-[140px] px-3 py-2 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition whitespace-nowrap"
                    >
                        {fromToken?.logoURI && (
                            <Image
                                src={fromToken.logoURI}
                                alt={fromToken.symbol}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                        )}
                        <span>{fromToken ? fromToken.symbol : "Select ▼"}</span>
                    </button>
                </div>
                {fromToken && (
                    <div className="text-xs text-zinc-500 mt-1 flex justify-end items-center gap-2">
                        <span>
                            {Number(fromBalance).toFixed(3)} {fromToken.symbol}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex justify-center my-4 text-gray-500">
                <AiOutlineSwap
                    onClick={handleSwitch}
                    className="text-3xl rotate-90 text-gray-500 hover:text-pink-500 transition cursor-pointer"
                />
            </div>

            <div className="mb-6">
                <div className="text-sm text-zinc-400 mb-1">To</div>
                <div className="flex items-center gap-3">
                    <input
                        disabled
                        placeholder="0.00"
                        className="w-full p-3 rounded-lg bg-zinc-800 text-white opacity-70"
                        value={toAmount}
                    />
                    <button
                        onClick={() => setShowToSelector(true)}
                        className="flex items-center gap-2 min-w-[100px] max-w-[140px] px-3 py-2 rounded-lg text-white bg-zinc-700 hover:bg-zinc-600 transition whitespace-nowrap"
                    >
                        {toToken?.logoURI && (
                            <Image
                                src={toToken.logoURI}
                                alt={toToken.symbol}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                        )}
                        <span>{toToken ? toToken.symbol : "Select ▼"}</span>
                    </button>
                </div>
                {toToken && (
                    <div className="text-xs text-zinc-500 mt-1 flex justify-between items-center">
                        <span>
                            Minimum Received: {minReceived ? `${minReceived} ${toToken.symbol}` : "--"}
                        </span>
                        <span>
                            {Number(toBalance).toFixed(3)} {toToken.symbol}
                        </span>
                    </div>
                )}
            </div>

            <div className="my-5">
                <SlippageSelector slippage={slippage} setSlippage={setSlippage} />
            </div>


            {hasSufficientAllowance() ? (
                <button
                    onClick={handleSwap}
                    disabled={!fromToken || !toToken || !fromAmount || swapStatus.isPending}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {swapStatus.isPending ? "Swapping..." : "Swap"}
                </button>
            ) : (
                <button
                    onClick={handleApprove}
                    disabled={!fromToken || !fromAmount || approveStatus.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {approveStatus.isPending ? "Approving..." : "Approve"}
                </button>
            )}

            {estimatedGas && (
                <div className="flex items-center text-xs text-zinc-400 mt-3 gap-2">
                    <FaGasPump className="text-base text-amber-400" />
                    Estimated Gas: {estimatedGas ? toReadableAmount(Number(estimatedGas), 9) : "--"} Gwei
                </div>
            )}

            {showFromSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <TokenSelector
                        onSelect={(token) => {

                            setFromToken(token)
                            setShowFromSelector(false)
                        }}
                        onClose={() => setShowFromSelector(false)}
                        excludeTokenAddress={toToken?.address}
                    />
                </div>
            )}

            {showToSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <TokenSelector
                        onSelect={(token) => {
                            setToToken(token)
                            setShowToSelector(false)
                        }}
                        onClose={() => setShowToSelector(false)}
                        excludeTokenAddress={fromToken?.address}
                    />
                </div>
            )}
        </div>
    )
}

export default SwapWidget
