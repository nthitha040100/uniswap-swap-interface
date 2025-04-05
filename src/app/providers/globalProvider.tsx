"use client"

import React, { createContext } from "react"
import { useContext } from "react"
import { Chain } from "thirdweb"
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react"


interface GlobalContextProps {
    activeChain: Chain | null | undefined
    userAddress: string | null | undefined
}

const GlobalContext = createContext<GlobalContextProps>({
    activeChain: null,
    userAddress: null

})

const useGlobal = () => {
    return useContext(GlobalContext)
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {

    const activeChain = useActiveWalletChain();
    const activeAccount = useActiveAccount();

    const contextValue = {
        activeChain,
        userAddress: activeAccount?.address
    }

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export { GlobalProvider, GlobalContext, useGlobal }