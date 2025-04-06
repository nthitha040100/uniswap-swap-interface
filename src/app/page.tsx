'use client'

import { useActiveAccount } from "thirdweb/react"
import Header from "./components/Header"
import ConnectWallet from "./components/ConnectWallet"
import SwapWidget from "./components/SwapWidget"
import { Bounce, ToastContainer } from "react-toastify"
import TransactionHistory from "./components/TransactionHistory"
import { useGlobal } from "./providers/GlobalProviders"

export default function Home() {
  const account = useActiveAccount()
  const {txHistory} = useGlobal()

  return (
    <>
      <Header />

      {!account && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <ConnectWallet />
        </div>
      )}

      <div className="min-h-[calc(100vh-5rem)] flex items-start sm:items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          <SwapWidget />
          <TransactionHistory transactions={txHistory} />
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  )
}
