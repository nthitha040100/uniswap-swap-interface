import { useGlobal } from "../providers/GlobalProvider";

export const useWalletSafe = () => {
  const { signer, provider, userAddress } = useGlobal();

  const isReady = !!signer && !!provider && !!userAddress;

  return isReady ? { signer, provider, userAddress } : null;
};
