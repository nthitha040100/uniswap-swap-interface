'use client'

import { useEffect, useState } from "react"
import { Token as UniToken, CurrencyAmount } from "@uniswap/sdk-core"
import { Route, Pool, FeeAmount } from "@uniswap/v3-sdk"
import { UseQuoteResult } from "@/types/swapTypes"
import { getPoolData } from "../lib/getPoolData"
import { toast } from "react-toastify"
import { useWalletSafe } from "./useWalletSafe"

export function useQuote(
  fromToken: UniToken | null,
  toToken: UniToken | null,
  amountIn: string,
  slippage: number
): UseQuoteResult {
  const [quote, setQuote] = useState<UseQuoteResult>({ quote: "", minReceived: "" })
  const wallet = useWalletSafe()


  useEffect(() => {

    if (!wallet) {
      toast.error("Connect your wallet to proceed");
      return;
    }

    const { provider } = wallet;

    async function fetchQuote() {
      if (!fromToken || !toToken || !amountIn || Number(amountIn) === 0) {
        setQuote({ quote: "", minReceived: "" })
        return
      }

      try {
        const poolData = await getPoolData(provider, fromToken, toToken, FeeAmount.MEDIUM)

        if (!poolData) {
          toast.error("No direct pool for this swap")
          return setQuote({ quote: "", minReceived: "" })
        }

        const pool = new Pool(
          fromToken,
          toToken,
          FeeAmount.MEDIUM,
          poolData.sqrtPriceX96.toString(),
          poolData.liquidity.toString(),
          poolData.tick
        )

        const route = new Route([pool], fromToken, toToken)

        const amount = CurrencyAmount.fromRawAmount(
          fromToken,
          BigInt(Math.floor(Number(amountIn) * 10 ** fromToken.decimals)).toString()
        )

        const tradeOut = route.midPrice.quote(amount)

        const quoteStr = tradeOut.toSignificant(6)
        const quoteFloat = parseFloat(quoteStr)

        const minReceived = (quoteFloat * (1 - slippage / 100)).toFixed(6)

        setQuote({ quote: quoteStr, minReceived })
      } catch (err) {
        console.error("Quote Error:", err)
        setQuote({ quote: "", minReceived: "" })
      }
    }

    fetchQuote()
  }, [fromToken, toToken, amountIn, wallet, slippage])

  return quote
}
