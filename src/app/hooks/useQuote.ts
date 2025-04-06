'use client';

import { useCallback } from "react";
import { Token as UniToken, CurrencyAmount, Percent, TradeType } from "@uniswap/sdk-core";
import { Route, Pool, FeeAmount, Trade, SwapRouter } from "@uniswap/v3-sdk";
import { UseQuoteResult } from "@/types/swapTypes";
import { getPoolData } from "../lib/getPoolData";
import { useWalletSafe } from "./useWalletSafe";
import { ethers } from "ethers";
import { UNISWAP_ROUTER } from "../constants/addresses";
import { extractGasErrorMessage } from "@/utils/errorHandler";

export function useQuote(): {
  getQuote: (
    params: {
      fromToken: UniToken;
      toToken: UniToken;
      amountIn: string;
      slippage: number;
      isApproved?: boolean;
    }
  ) => Promise<UseQuoteResult>;
} {
  const wallet = useWalletSafe();

  const getQuote = useCallback(
    async ({
      fromToken,
      toToken,
      amountIn,
      slippage,
      isApproved = true,
    }: {
      fromToken: UniToken;
      toToken: UniToken;
      amountIn: string;
      slippage: number;
      isApproved?: boolean;
    }): Promise<UseQuoteResult> => {
      if (!wallet || !amountIn || Number(amountIn) === 0) {
        return {
          quote: "",
          minReceived: "",
          status: "idle",
          gasEstimate: null,
        };
      }

      const { provider, signer, userAddress } = wallet;

      try {
        const poolData = await getPoolData(provider, fromToken, toToken, FeeAmount.MEDIUM);
        if (!poolData) {
          return {
            quote: "",
            minReceived: "",
            status: "noPool",
            gasEstimate: null,
          };
        }

        const pool = new Pool(
          fromToken,
          toToken,
          FeeAmount.MEDIUM,
          poolData.sqrtPriceX96.toString(),
          poolData.liquidity.toString(),
          poolData.tick
        );

        const route = new Route([pool], fromToken, toToken);

        const inputAmount = CurrencyAmount.fromRawAmount(
          fromToken,
          BigInt(Math.floor(Number(amountIn) * 10 ** fromToken.decimals)).toString()
        );

        const outputAmount = route.midPrice.quote(inputAmount);

        const trade = Trade.createUncheckedTrade({
          route,
          inputAmount,
          outputAmount,
          tradeType: TradeType.EXACT_INPUT,
        });

        let gasEstimate: string | null = null;

        if (isApproved) {
          try {
            const methodParams = SwapRouter.swapCallParameters([trade], {
              slippageTolerance: new Percent(slippage * 100, 10_000),
              recipient: userAddress!,
              deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            });

            const tx: ethers.providers.TransactionRequest = {
              to: UNISWAP_ROUTER,
              data: methodParams.calldata,
              value: methodParams.value,
            };

            const gas = await signer!.estimateGas(tx);
            gasEstimate = gas.toString();
          } catch (err) {
            const reason = extractGasErrorMessage(err);
            console.warn("Gas estimation failed:", reason);
          }
        }

        const quoteStr = outputAmount.toSignificant(6);
        const quoteFloat = parseFloat(quoteStr);
        const minReceived = (quoteFloat * (1 - slippage / 100)).toFixed(6);

        return {
          quote: quoteStr,
          minReceived,
          status: "success",
          gasEstimate,
        };
      } catch (err) {
        console.error("Quote Error:", err);
        return {
          quote: "",
          minReceived: "",
          status: "failed",
          gasEstimate: null,
        };
      }
    },
    [wallet]
  );

  return { getQuote };
}
