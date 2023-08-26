import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction } from "@wagmi/core";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

export function useLottery() {
  const [betPrice, setBetPrice] = useState<bigint>();
  const [betFee, setBetFee] = useState<bigint>();

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
  };
}
