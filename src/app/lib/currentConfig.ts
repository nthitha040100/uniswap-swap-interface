import { Token as UniToken } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { Environment, ExampleConfig, Token } from '@/utils/types'

export const getCurrentConfig = (
    fromToken: Token,
    toToken: Token,
    amount: string
): ExampleConfig => {

    const fromUniToken = new UniToken(
        fromToken.chainId,
        fromToken.address,
        fromToken.decimals,
        fromToken.symbol,
        fromToken.name
    )

    const toUniToken = new UniToken(
        toToken.chainId,
        toToken.address,
        toToken.decimals,
        toToken.symbol,
        toToken.name
    )

    return {
        env: Environment.WALLET_EXTENSION,
        rpc: {
            local: 'http://localhost:8545',
            mainnet: '',
        },
        wallet: {
            address: '',
            privateKey:
                '',
        },
        tokens: {
            in: fromUniToken,
            amountIn: Number(amount),            
            out: toUniToken,
            poolFee: FeeAmount.MEDIUM,
        }
    }
}