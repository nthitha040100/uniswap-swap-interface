'use client'

import { useEffect, useState } from "react"
import { getContract } from "thirdweb"
import { useGlobal } from "../providers/GlobalProvider"
import client from "@/utils/thirdwebClient"
import { Token } from "@/types/swapTypes"
import { allowance as erc20Allowance } from "thirdweb/extensions/erc20"
import { formatUnits } from "ethers/lib/utils"
import { UNISWAP_ROUTER } from "../constants/addresses"

export function useAllowance(token: Token | null) {
  const [allowance, setAllowance] = useState<string>("0")
  const { activeChain, userAddress } = useGlobal()

  useEffect(() => {
    if (!activeChain || !token || !userAddress) return    

    const fetchAllowance = async () => {
      try {
        const tokenContract = getContract({
          address: token.address,
          client,
          chain: activeChain,
        })

        const rawAllowance = await erc20Allowance({
          contract: tokenContract,
          owner: userAddress,
          spender:UNISWAP_ROUTER as string,
        })

        setAllowance(formatUnits(rawAllowance, token.decimals))
      } catch (err) {
        console.error("Error fetching allowance:", err)
        setAllowance("0")
      }
    }

    fetchAllowance()
  }, [token, activeChain, userAddress])

  return allowance
}
