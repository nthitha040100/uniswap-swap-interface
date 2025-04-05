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