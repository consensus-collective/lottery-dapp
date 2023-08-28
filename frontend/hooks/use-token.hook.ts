import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction } from "@wagmi/core";
import { ExplorerURL } from "@/components/common/explorer-url";

import TOKEN from "@/artifacts/token.json";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;

interface ContractData {
  data?: bigint;
}

export function useToken(spender?: string) {
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useAccount();
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
      message: "TransactionSucceed",
      variant: "success",
      action: (id) => ExplorerURL({ href: url, snackbarId: id }),
    });
  };

  const approve = useContractWrite({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi,
    functionName: "approve",
    onError,
    onSuccess,
  });

  const allowance = useContractRead({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi as any,
    functionName: "allowance",
    args: [address, spender],
    watch: true,
  });

  const balanceOf = useContractRead({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  return {
    approve,
    balance: (balanceOf as ContractData)?.data ?? BigInt(0),
    allowance: (allowance as ContractData)?.data ?? BigInt(0),
  };
}
