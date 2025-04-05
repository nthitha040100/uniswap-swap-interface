'use client'

import { useEffect, useState } from "react"
import { Token as UniToken, CurrencyAmount } from "@uniswap/sdk-core"
import { Route, Pool, FeeAmount } from "@uniswap/v3-sdk"
import { Token, UseQuoteResult } from "@/utils/types"
import { getEthersProvider } from "../lib/getEthersProvider"
import { getPoolData } from "../lib/getPoolData"
import { toast } from "react-toastify"

export function useQuote(
  fromToken: Token | null,
  toToken: Token | null,
  amountIn: string,
  slippage: number
): UseQuoteResult {
  const [quote, setQuote] = useState<UseQuoteResult>({ quote: "", minReceived: "" })

  useEffect(() => {
    async function fetchQuote() {
      if (!fromToken || !toToken || !amountIn || Number(amountIn) === 0) {
        setQuote({ quote: "", minReceived: "" })
        return
      }

      try {
        const chainId = fromToken.chainId
        const provider = getEthersProvider(chainId)

        const tokenIn = new UniToken(chainId, fromToken.address, fromToken.decimals, fromToken.symbol)
        const tokenOut = new UniToken(chainId, toToken.address, toToken.decimals, toToken.symbol)

        const poolData = await getPoolData(provider, tokenIn, tokenOut, FeeAmount.MEDIUM)
        
        if (!poolData) {
          toast.error("No direct pool for this swap")
          return setQuote({ quote: "", minReceived: "" })
        }

        const pool = new Pool(
          tokenIn,
          tokenOut,
          FeeAmount.MEDIUM,
          poolData.sqrtPriceX96.toString(),
          poolData.liquidity.toString(),
          poolData.tick
        )

        const route = new Route([pool], tokenIn, tokenOut)

        const amount = CurrencyAmount.fromRawAmount(
          tokenIn,
          BigInt(Math.floor(Number(amountIn) * 10 ** tokenIn.decimals)).toString()
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
  }, [fromToken, toToken, amountIn, slippage])

  return quote
}
