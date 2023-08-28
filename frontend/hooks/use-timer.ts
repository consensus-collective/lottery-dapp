import {
  useContractRead,
  useContractWrite,
  useNetwork,
  usePublicClient,
} from "wagmi";
import { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { useSnackbar } from "notistack";
import { ExplorerURL } from "@/components/common/explorer-url";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

// Get block timestamp
// const provider = new ethers.JsonRpcProvider('YOUR_INFURA_PROJECT_URL');

export function useTimer() {
  const [timer, setTimer] = useState<number>(0);
  const [blockTimestamp, setBlockTimestamp] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();
  const { getBlock } = usePublicClient();
  const { chain } = useNetwork();

  // Set block timestamp
  useEffect(() => {
    getBlock().then((block) => {
      setBlockTimestamp(Number(block.timestamp));
    });
  }, [getBlock]);

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

  const betsclosingTimeData = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betsClosingTime",
  });

  useEffect(() => {
    if (betsclosingTimeData?.data) {
      const timeRemaining = Number(betsclosingTimeData.data) - blockTimestamp;
      setTimer(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [betsclosingTimeData]);

  const closeLottery = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "closeLottery",
    onError,
    onSuccess,
  });

  return { timer, closeLottery };
}
