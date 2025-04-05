export function normalizeIpfsUri(uri: string): string {
    if (!uri) return ''
    if (uri.startsWith("ipfs://")) {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    }
    return uri
  }