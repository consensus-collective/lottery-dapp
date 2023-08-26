import { useContractWrite, useNetwork } from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction } from "@wagmi/core";

import TOKEN from "@/artifacts/token.json";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;

export function useToken() {
  const { enqueueSnackbar } = useSnackbar();
  const { chain } = useNetwork();

  const onError = (error: any) => {
    enqueueSnackbar({
      variant: "error",
      message: error.name,
      autoHideDuration: 5000,
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
      autoHideDuration: 5000,
    });
  };

  const approve = useContractWrite({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi,
    functionName: "approve",
    onError,
    onSuccess,
  });

  return {
    approve,
  };
}
