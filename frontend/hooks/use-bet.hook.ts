import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction } from "@wagmi/core";

import TOKEN from "@/artifacts/token.json";
import LOTTERY from "@/artifacts/lottery.json";
import { useEffect, useState } from "react";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;
const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

interface ContractData {
  data?: bigint;
}

export function useBet(address?: string) {
  const [totalBet, setTotalBet] = useState<bigint>(BigInt(0));

  const { enqueueSnackbar } = useSnackbar();
  const { chain } = useNetwork();

  const betPrice = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "betPrice",
    args: [],
    watch: true,
  });

  const betFee = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "betFee",
    args: [],
    watch: true,
  });

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

  const bet = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "bet",
    onError,
    onSuccess,
  });

  const betMany = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betMany",
    onError,
    onSuccess,
  });

  const approve = useContractWrite({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi,
    functionName: "approve",
    args: [LOTTERY_CONTRACT, totalBet],
    onError,
    onSuccess,
  });

  const allowance = useContractRead({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: TOKEN.abi as any,
    functionName: "allowance",
    args: [address, LOTTERY_CONTRACT],
    watch: true,
  });

  useEffect(() => {
    const fee = betFee as ContractData;
    const price = betPrice as ContractData;
    const total = (fee?.data ?? BigInt(0)) + (price?.data ?? BigInt(0));
    setTotalBet(total);
  }, [betFee, betPrice]);

  return {
    purchaseTokens,
    bet,
    betMany,
    approve,
    totalBet,
    allowance: (allowance as ContractData)?.data ?? BigInt(0),
  };
}
