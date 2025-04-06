export function getExplorerTxUrl(chainId: number, txHash: string): string {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/tx/${txHash}`;
      case 42161:
        return `https://arbiscan.io/tx/${txHash}`;
      default:
        return `https://blockscan.com/tx/${txHash}`;
    }
  }
  