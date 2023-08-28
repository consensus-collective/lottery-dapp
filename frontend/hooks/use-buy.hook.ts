import { useSnackbar } from "notistack";
import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { waitForTransaction } from "@wagmi/core";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

interface ContractData {
  data?: bigint;
}

export function useBuy() {
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
    watch: true,
  });

  return {
    purchaseTokens,
    purchaseRatio: (purchaseRatio as ContractData)?.data ?? BigInt(1),
  };
}
