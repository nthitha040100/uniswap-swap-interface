import { Token } from '@/types/swapTypes'
import { Token as UniToken} from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export function fromReadableAmount(
  amount: number,
  decimals: number
): BigNumber {
  return parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount: number, decimals: number): string {
  return formatUnits(rawAmount, decimals)
}

export function convertToUniToken(token: Token | null): UniToken | null {
  return token
    ? new UniToken(token.chainId, token.address, token.decimals, token.symbol, token.name)
    : null;
}
