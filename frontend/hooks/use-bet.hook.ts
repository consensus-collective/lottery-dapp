import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction, readContract } from "@wagmi/core";

import TOKEN from "@/artifacts/token.json";
import LOTTERY from "@/artifacts/lottery.json";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;
const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

export function useBet(address?: string) {
  const [betPrice, setBetPrice] = useState<bigint>();
  const [betFee, setBetFee] = useState<bigint>();

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
    args: [LOTTERY_CONTRACT, (betFee ?? BigInt(0)) + (betPrice ?? BigInt(0))],
    onError,
    onSuccess,
  });

  const checkAllowance = async (
    cb?: (allowance: bigint, totalBet: bigint) => void,
  ) => {
    if (!betPrice || !betFee) return;
    if (!address) return;
    const allowance = await readContract({
      address: TOKEN_CONTRACT as `0x${string}`,
      abi: TOKEN.abi as any,
      functionName: "allowance",
      args: [address, LOTTERY_CONTRACT],
    });

    const allowanceBN = allowance as unknown as bigint;
    const totalBet = betPrice + betFee;

    if (cb) cb(allowanceBN, totalBet);
  };

  const betPriceData = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "betPrice",
    args: [],
  });

  const betFeeData = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "betFee",
    args: [],
  });

  useEffect(() => {
    if (betPriceData?.data) {
      setBetPrice(betPriceData.data as unknown as bigint);
    }

    if (betFeeData?.data) {
      setBetFee(betFeeData.data as unknown as bigint);
    }
  }, [betPriceData, betFeeData]);

  return {
    purchaseTokens,
    bet,
    betMany,
    betFee,
    betPrice,
    approve,
    checkAllowance,
  };
}
