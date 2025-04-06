import { useGlobal } from "../providers/GlobalProvider";
import { useMemo } from "react";

export const useWalletSafe = () => {
  const { signer, provider, userAddress } = useGlobal();

  return useMemo(() => {
    if (!signer || !provider || !userAddress) {
      return null;
    }

    return { signer, provider, userAddress };
  }, [signer, provider, userAddress]);
};
