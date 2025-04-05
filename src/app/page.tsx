'use client'

import { useActiveAccount } from "thirdweb/react"
import Header from "./components/Header"
import ConnectWallet from "./components/ConnectWallet"
import SwapWidget from "./components/SwapWidget"

export default function Home() {
  const account = useActiveAccount()

  return (
    <>
      <Header />

      {!account && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <ConnectWallet />
        </div>
      )}

      <SwapWidget />      
    </>
  )
}
