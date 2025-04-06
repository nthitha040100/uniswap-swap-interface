'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { Chain } from "thirdweb"
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react"
import { ethers } from "ethers"

interface GlobalContextProps {
  activeChain: Chain | null | undefined
  userAddress: string | null | undefined
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  walletConnected: boolean
}

const GlobalContext = createContext<GlobalContextProps>({
  activeChain: null,
  userAddress: null,
  provider: null,
  signer: null,
  walletConnected: false
})

export const useGlobal = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const activeChain = useActiveWalletChain()
  const activeAccount = useActiveAccount()

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)

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


  const contextValue = useMemo(() => ({
    activeChain,
    userAddress: activeAccount?.address,
    provider,
    signer,
    walletConnected
  }), [activeChain, activeAccount?.address, provider, signer, walletConnected]);
  

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}
