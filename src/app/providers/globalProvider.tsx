'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { Chain } from "thirdweb"
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react"
import { ethers } from "ethers"
import { SwapTransaction } from "@/types/swapTypes"

interface GlobalContextProps {
  activeChain: Chain | null | undefined;
  userAddress: string | null | undefined;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  walletConnected: boolean;
  txHistory: SwapTransaction[];
  addTransaction: (tx: SwapTransaction) => void;
}

const GlobalContext = createContext<GlobalContextProps>({
  activeChain: null,
  userAddress: null,
  provider: null,
  signer: null,
  walletConnected: false,
  txHistory: [],
  addTransaction: () => {}
})

export const useGlobal = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const activeChain = useActiveWalletChain()
  const activeAccount = useActiveAccount()

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [txHistory, setTxHistory] = useState<SwapTransaction[]>([]);

  useEffect(() => {
    const setup = async () => {
      if (typeof window !== "undefined" && window.ethereum && activeAccount?.address) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(web3Provider)

        const signerInstance = web3Provider.getSigner()
        setSigner(signerInstance)
      } else {
        setProvider(null)
        setSigner(null)
      }
    }

    setup()
  }, [activeAccount?.address, activeChain?.id])

  useEffect(()=>{
    setWalletConnected(!!activeAccount?.address && !!signer && !!provider)
  },[activeAccount, signer, provider])

  const contextValue = useMemo(() => {
    const addTransaction = (tx: SwapTransaction) => {
      setTxHistory(prev => [tx, ...prev.slice(0, 9)]);
    };
  
    return {
      activeChain,
      userAddress: activeAccount?.address,
      provider,
      signer,
      walletConnected,
      txHistory,
      addTransaction,
    };
  }, [activeChain, activeAccount?.address, provider, signer, walletConnected, txHistory]);
  
  

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}
