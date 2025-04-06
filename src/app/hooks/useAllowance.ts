'use client'

import { useEffect, useState, useCallback } from "react"
import { getContract } from "thirdweb"
import { useGlobal } from "../providers/GlobalProviders"
import client from "@/utils/thirdwebClient"
import { Token } from "@/types/swapTypes"
import { allowance as erc20Allowance } from "thirdweb/extensions/erc20"
import { formatUnits } from "ethers/lib/utils"
import { UNISWAP_ROUTER } from "../constants/addresses"

export function useAllowance(token: Token | null): {
  allowance: string;
  refetchAllowance: () => Promise<void>;
} {
  const [allowance, setAllowance] = useState<string>("0")
  const { activeChain, userAddress } = useGlobal()

  const refetchAllowance = useCallback(async () => {
    if (!activeChain || !token || !userAddress) return;

    try {
      const tokenContract = getContract({
        address: token.address,
        client,
        chain: activeChain,
      });

      const rawAllowance = await erc20Allowance({
        contract: tokenContract,
        owner: userAddress,
        spender: UNISWAP_ROUTER,
      });

      setAllowance(formatUnits(rawAllowance, token.decimals));
    } catch (err) {
      console.error("Error fetching allowance:", err);
      setAllowance("0");
    }
  }, [token, activeChain, userAddress]);

  useEffect(() => {
    if (token) refetchAllowance();
  }, [refetchAllowance, token]);

  return {
    allowance,
    refetchAllowance: refetchAllowance ?? (async () => {}),
  };
}

