import { useGlobal } from "../providers/GlobalProviders"
import ConnectWallet from "./ConnectWallet"

const Header = () => {

  const { walletConnected } = useGlobal()

  if (!walletConnected) return null

  return (
    <header className="w-full px-4 py-3 border-b border-zinc-800 bg-[#1a1a1a] flex items-center justify-between">
      <h1 className="text-white text-lg font-semibold">
        Uniswap Swap Interface
      </h1>
      <ConnectWallet />
    </header>
  )
}

export default Header
