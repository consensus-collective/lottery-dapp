import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { waitForTransaction } from "@wagmi/core";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

export function useBuy() {
  const [ratio, setRatio] = useState<bigint>(BigInt(1));

  const { enqueueSnackbar } = useSnackbar();
  const { chain } = useNetwork();

  const onError = (error: any) => {
    enqueueSnackbar({
      variant: "error",
      message: error.name,
    });
  };

  const onSuccess = async (data: any) => {
    const { hash } = data;
    const { transactionHash } = await waitForTransaction({ hash });

    const explorer = chain?.blockExplorers?.default.url;
    if (!explorer) return;
    const url = `${explorer}/tx/${transactionHash}`;

    enqueueSnackbar({
      variant: "transactionHash",
      message: url,
      hash: hash,
    });
  };

  const purchaseTokens = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "purchaseTokens",
    onError,
    onSuccess,
  });

  const purchaseRatio = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "purchaseRatio",
    args: [],
  });

  useEffect(() => {
    if (purchaseRatio?.data) {
      setRatio(purchaseRatio?.data as unknown as bigint);
    }
  }, [purchaseRatio]);

  return {
    purchaseTokens,
    purchaseRatio: ratio,
  };
}
