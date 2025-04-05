import { ethers } from "ethers"
import { ALCHEMY_RPC_URLS } from "./rpc"

export function getEthersProvider(chainId: number): ethers.providers.JsonRpcProvider {
  const rpcUrl = ALCHEMY_RPC_URLS[chainId]
  if (!rpcUrl) throw new Error(`No RPC URL configured for chainId: ${chainId}`)

  return new ethers.providers.JsonRpcProvider(rpcUrl)
}
