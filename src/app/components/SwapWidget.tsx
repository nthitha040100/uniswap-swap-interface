'use client'

import { useState } from "react"
import TokenSelector from "./TokenSelector"
import { AiOutlineSwap } from "react-icons/ai";
import Image from "next/image"
import { useTokenBalance } from "../hooks/useTokenBalance";
import { Token } from "@/utils/types";

const SwapWidget = () => {
    const [fromToken, setFromToken] = useState<Token | null>(null)
    const [toToken, setToToken] = useState<Token | null>(null)
    const [fromAmount, setFromAmount] = useState("")
    const [showFromSelector, setShowFromSelector] = useState(false)
    const [showToSelector, setShowToSelector] = useState(false)

    const fromBalance = useTokenBalance(fromToken)
    const toBalance = useTokenBalance(toToken)


    const handleSwitch = () => {
        const temp = fromToken
        setFromToken(toToken)
        setToToken(temp)
    }


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
                    <div className="text-xs text-zinc-500 mt-1 text-right">
                        {Number(fromBalance).toFixed(3)} {fromToken.symbol}
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
                    <div className="text-xs text-zinc-500 mt-1 text-right">
                        {Number(toBalance).toFixed()} {toToken.symbol}
                    </div>
                )}
            </div>

            <button
                disabled={!fromToken || !toToken || !fromAmount}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Swap
            </button>

            {showFromSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <TokenSelector
                        onSelect={(token) => {
                            console.log("swap From :", token)
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
                            console.log("swap To :", token)
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
