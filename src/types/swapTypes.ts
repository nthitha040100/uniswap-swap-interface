import { TradeType, Token as UniToken } from "@uniswap/sdk-core"
import { FeeAmount, Trade } from "@uniswap/v3-sdk"
import { ethers } from "ethers"

export type Token = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type QuoteFetchStatus = "idle" | "success" | "failed" | "noPool";

export type UseQuoteResult = {
  quote: string
  minReceived: string
  status: QuoteFetchStatus
  gasEstimate: string | null

}

export enum Environment {
  LOCAL,
  MAINNET,
  WALLET_EXTENSION,
}


export interface ExampleConfig {
  env: Environment
  rpc: {
    local: string
    mainnet: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    in: UniToken
    amountIn: number
    out: UniToken
    poolFee: number
  }
}

export type CreateTradeParams = {
    fromToken: UniToken;
    toToken: UniToken;
    amountIn: string;
    fee?: FeeAmount;
}

export type ExecuteSwapParams = {
    trade: Trade<UniToken, UniToken, TradeType.EXACT_INPUT>;
    slippagePercent: number;
}

export type SwapStatus = {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: Error;
  data?: ethers.providers.TransactionReceipt;
  txHash?: string;
  gasEstimate?: string;
}

export type SwapTransaction = {
  txHash: string;
  timestamp: number;
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
  toAmount: string;
}

