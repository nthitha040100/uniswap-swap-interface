import { Token as UniToken} from "@uniswap/sdk-core"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type UseQuoteResult = {
  quote: string         
  minReceived: string   
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
