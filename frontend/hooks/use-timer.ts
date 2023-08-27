import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { useSnackbar } from "notistack";
import LOTTERY from "@/artifacts/lottery.json";
import { ethers } from 'ethers';


const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

// Get block timestamp
// const provider = new ethers.JsonRpcProvider('YOUR_INFURA_PROJECT_URL');


export function useTimer() {

    const [timer, setTimer] = useState<number>(0);

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

    const betsclosingTimeData = useContractRead({
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi,
        functionName: "betsClosingTime"
      });

      useEffect(() => {
        if (betsclosingTimeData?.data) {
            const timeRemaining = Number(betsclosingTimeData.data)
            setTimer(timeRemaining as unknown as number);
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