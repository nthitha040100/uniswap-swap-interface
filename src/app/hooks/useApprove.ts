'use client'

import { getContract } from "thirdweb";
import { approve as erc20Approve } from "thirdweb/extensions/erc20";
import { toast } from "react-toastify";
import { Token } from "@/types/swapTypes";
import client from "@/utils/thirdwebClient";
import { UNISWAP_ROUTER } from "../constants/addresses";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { useEffect } from "react";
import { useGlobal } from "../providers/GlobalProviders";

export const useApprove = () => {
  const {
    mutate: sendTransaction,
    isPending,
    isError,
    isSuccess,
    error,
    data,
  } = useSendAndConfirmTransaction();

  const { activeChain: chain } = useGlobal();

  useEffect(() => {
    toast.dismiss();

    if (isPending) {
      toast.loading("Approving...");
    } else if (isSuccess) {
      toast.success("Token Approved");
    } else if (isError) {
      toast.error("Approval Failed");
    }
  }, [isPending, isSuccess, isError]);

  const approveToken = async ({
    token,
    amount,
  }: {
    token: Token;
    amount: string;
  }): Promise<void> => {
    if (!chain) {
      toast.error("No active chain found");
      return;
    }

    try {
      const contract = getContract({
        address: token.address,
        client,
        chain,
      });

      const tx = erc20Approve({
        contract,
        spender: UNISWAP_ROUTER,
        amount,
      });

      sendTransaction(tx);
    } catch (err) {
      console.error("Approval error:", err);
      toast.dismiss();
      toast.error("Approval failed");
    }
  };

  return {
    approveToken,
    approveStatus: {
      isPending,
      isSuccess,
      isError,
      error,
      data,
    },
  };
};
