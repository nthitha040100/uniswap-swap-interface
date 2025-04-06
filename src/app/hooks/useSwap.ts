'use client';

import { useCallback, useState } from "react";
import {
    CurrencyAmount,
    Percent,
    Token as UniToken,
    TradeType,
} from "@uniswap/sdk-core";
import {
    FeeAmount,
    Trade,
    Pool,
    Route,
    SwapRouter,
    MethodParameters,
} from "@uniswap/v3-sdk";
import { toast } from "react-toastify";
import { fromReadableAmount } from "../lib/conversion";
import { getPoolData } from "../lib/getPoolData";
import { useGlobal } from "../providers/GlobalProvider";
import { ethers } from "ethers";
import { UNISWAP_ROUTER } from "../constants/addresses";
import { useWalletSafe } from "./useWalletSafe";
import { CreateTradeParams, ExecuteSwapParams, SwapStatus } from "@/types/swapTypes";

export const useSwap = () => {
    const { activeChain } = useGlobal();
    const wallet = useWalletSafe();

    const [swapStatus, setSwapStatus] = useState<SwapStatus>({
        isPending: false,
        isSuccess: false,
        isError: false,
    });

    const createTrade = useCallback(
        async ({
            fromToken,
            toToken,
            amountIn,
            fee = FeeAmount.MEDIUM,
        }: CreateTradeParams): Promise<Trade<UniToken, UniToken, TradeType.EXACT_INPUT> | null> => {
            if (!wallet) {
                toast.error("Wallet not connected");
                return null;
            }

            const { provider } = wallet;

            try {
                const chainId = activeChain?.id;
                if (!chainId) {
                    toast.error("No active chain found");
                    return null;
                }

                const poolData = await getPoolData(provider, fromToken, toToken, fee);
                if (!poolData) {
                    toast.error("No pool found");
                    return null;
                }

                const pool = new Pool(
                    fromToken,
                    toToken,
                    fee,
                    poolData.sqrtPriceX96.toString(),
                    poolData.liquidity.toString(),
                    poolData.tick
                );

                const route = new Route([pool], fromToken, toToken);

                const inputAmount = CurrencyAmount.fromRawAmount(
                    fromToken,
                    fromReadableAmount(Number(amountIn), fromToken.decimals).toString()
                );

                const outputAmount = route.midPrice.quote(inputAmount);

                return Trade.createUncheckedTrade({
                    route,
                    inputAmount,
                    outputAmount,
                    tradeType: TradeType.EXACT_INPUT,
                });
            } catch (err) {
                console.error("Trade creation failed:", err);
                toast.error("Failed to create trade route");
                return null;
            }
        },
        [wallet, activeChain?.id]
    );

    const executeSwap = useCallback(
        async ({
            trade,
            slippagePercent,
        }: ExecuteSwapParams): Promise<void> => {
            if (!wallet) {
                toast.error("Wallet not connected");
                return;
            }

            const { userAddress, signer } = wallet;

            try {
                setSwapStatus({
                    isPending: true,
                    isSuccess: false,
                    isError: false,
                });

                toast.dismiss();
                toast.loading("Swapping...");

                const methodParams: MethodParameters = SwapRouter.swapCallParameters(
                    [trade],
                    {
                        slippageTolerance: new Percent(slippagePercent * 100, 10_000),
                        recipient: userAddress,
                        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
                    }
                );

                const tx: ethers.providers.TransactionRequest = {
                    to: UNISWAP_ROUTER,
                    data: methodParams.calldata,
                    value: methodParams.value,
                };

                const txResponse = await signer.sendTransaction(tx);
                console.log("Swap TX sent:", txResponse.hash);

                const receipt = await txResponse.wait();
                console.log("Swap TX confirmed:", receipt);

                toast.dismiss();
                toast.success("Swap successful!");

                setSwapStatus({
                    isPending: false,
                    isSuccess: true,
                    isError: false,
                    data: receipt,
                });
            } catch (err: unknown) {
                console.error("Swap failed:", err);

                toast.dismiss();
                toast.error("Swap failed");

                setSwapStatus({
                    isPending: false,
                    isSuccess: false,
                    isError: true,
                    error: err instanceof Error ? err : new Error("Unknown swap error"),
                });
            }
        },
        [wallet]
    );

    return {
        createTrade,
        executeSwap,
        swapStatus,
    };
};
