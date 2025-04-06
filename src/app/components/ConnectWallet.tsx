import { ConnectButton } from "thirdweb/react"
import { arbitrum, ethereum } from "thirdweb/chains"
import client from "@/utils/thirdwebClient"

const ConnectWallet = () => {
  return (
    <ConnectButton
      client={client}
      chains={[ethereum, arbitrum]}
      connectButton={{
        label: "Connect Wallet",
        style: {
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "14px",
          border: "1px solid #555",
          cursor: "pointer",
        },
      }}
    />
  )
}

export default ConnectWallet
