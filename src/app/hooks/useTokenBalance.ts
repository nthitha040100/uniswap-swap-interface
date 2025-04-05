'use client'

import { useEffect, useState } from "react"
import { eth_getBalance, getContract, getRpcClient, NATIVE_TOKEN_ADDRESS } from "thirdweb"
import client from "@/utils/thirdwebClient"
import { useGlobal } from "../providers/globalProvider"
import { balanceOf } from "thirdweb/extensions/erc20"
import { Token } from "@/utils/types"
import { formatUnits } from "ethers/lib/utils"


export function useTokenBalance(token: Token | null) {

    const [balance, setBalance] = useState<string>("0")
    const { activeChain, userAddress } = useGlobal()
    

    useEffect(() => {
        if (!activeChain || !token || !userAddress) return

        const fetchBalance = async () => {
            try {

                if (token.address === NATIVE_TOKEN_ADDRESS) {

                    const rpcRequest = getRpcClient({ client, chain: activeChain });
                    const native = await eth_getBalance(rpcRequest, {
                        address: userAddress,
                    });
                    
                    setBalance(formatUnits(native, token.decimals))
                    return
                }

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
