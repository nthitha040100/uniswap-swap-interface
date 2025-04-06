'use client'

import { useEffect, useState } from "react"
import { getContract } from "thirdweb"
import client from "@/utils/thirdwebClient"
import { useGlobal } from "../providers/GlobalProvider"
import { balanceOf } from "thirdweb/extensions/erc20"
import { formatUnits } from "ethers/lib/utils"
import { Token } from "@/types/swapTypes"


export function useTokenBalance(token: Token | null) {

    const [balance, setBalance] = useState<string>("0")
    const { activeChain, userAddress } = useGlobal()


    useEffect(() => {
        if (!activeChain || !token || !userAddress) return

        const fetchBalance = async () => {
            try {

                const tokenContract = getContract({
                    address: token.address,
                    client,
                    chain: activeChain,
                })

                const tokenBalance = await balanceOf({
                    contract: tokenContract,
                    address: userAddress,
                })

                setBalance(formatUnits(tokenBalance, token.decimals))
            } catch (err) {
                console.error("Error fetching balance:", err)
                setBalance("0")
            }
        }

        fetchBalance()
    }, [token, activeChain, userAddress])

    return balance
}
