import { Token } from "@/utils/types"
import { NATIVE_TOKEN_ADDRESS } from "thirdweb"

export function getNativeToken(chainId: number): Token {
  const map: Record<number, Token> = {
    1: {
      address: NATIVE_TOKEN_ADDRESS,
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",
      chainId: 1,
    },
    11155111: {
      address: NATIVE_TOKEN_ADDRESS,
      name: "Sepolia Ethereum",
      symbol: "ETH",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",
      chainId: 11155111,
    },
  }

  return map[chainId] ?? map[1]

}