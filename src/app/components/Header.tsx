import ConnectWallet from "./ConnectWallet"
import { useActiveAccount } from "thirdweb/react"

const Header = () => {
  const account = useActiveAccount()

  if (!account) return null

  return (
    <header className="w-full flex justify-end p-4 border-b border-gray-700 bg-[#1a1a1a]">
      <ConnectWallet />
    </header>
  )
}

export default Header
