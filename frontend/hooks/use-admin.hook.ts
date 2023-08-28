import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction, readContract } from "@wagmi/core";

import TOKEN from "@/artifacts/token.json";
import LOTTERY from "@/artifacts/lottery.json";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;
const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

interface ContractData {
  data?: bigint;
}

export function useAdmin() {
  const { enqueueSnackbar } = useSnackbar();
  const { chain } = useNetwork();
  const { address } = useAccount();

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

  const openBets = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "openBets",
    onError,
    onSuccess,
  });

  const ownerWithdraw = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "ownerWithdraw",
    onError,
    onSuccess,
  });

  const closeLottery = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "closeLottery",
    onError,
    onSuccess,
  });

  const approve = useContractWrite({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi,
    functionName: "approve",
    onError,
    onSuccess,
  });

  const returnTokens = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "returnTokens",
    onError,
    onSuccess,
  });

  const betsOpen = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betsOpen",
    args: [],
    watch: true,
  });

  const ownerPool = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "ownerPool",
    args: [],
    watch: true,
  });

  const betsClosingTime = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betsClosingTime",
    args: [],
    watch: true,
  });

  const balanceOf = useContractRead({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const purchaseRatio = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "purchaseRatio",
    args: [],
    watch: true,
  });

  const allowance = useContractRead({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi as any,
    functionName: "allowance",
    args: [address, LOTTERY_CONTRACT],
    watch: true,
  });

  return {
    approve,
    openBets,
    ownerWithdraw,
    closeLottery,
    returnTokens,
    betsOpen: Boolean(betsOpen?.data),
    ownerPool: (ownerPool as ContractData)?.data ?? BigInt(0),
    betsClosingTime: (betsClosingTime as ContractData)?.data ?? BigInt(0),
    balance: (balanceOf as ContractData)?.data ?? BigInt(0),
    purchaseRatio: (purchaseRatio as ContractData)?.data ?? BigInt(0),
    allowance: (allowance as ContractData)?.data ?? BigInt(0),
  };
}
