import { useGlobal } from "../providers/GlobalProvider"
import ConnectWallet from "./ConnectWallet"

const Header = () => {

  const {walletConnected} = useGlobal()

  if(!walletConnected) return null

  return (
    <header className="w-full flex justify-end p-4 border-b border-gray-700 bg-[#1a1a1a]">
      <ConnectWallet />
    </header>
  )
}

export default Header
