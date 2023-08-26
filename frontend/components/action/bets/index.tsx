import { useEffect, useState } from "react";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
} from "wagmi";

import styles from "./bets.module.css";

import LOTTERY from "@/artifacts/lottery.json";
import TOKEN from "@/artifacts/token.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;

export default function PlaceBets() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(false);
  const [text, setText] = useState<string>("Loading...");

  const { chain } = useNetwork();
  const { address, isDisconnected } = useAccount();

  const { data, isLoading: isLoadingRead } = useContractReads({
    contracts: [
      {
        address: TOKEN_CONTRACT as `0x${string}`,
        abi: TOKEN.abi as any,
        functionName: "allowance",
        args: [address, LOTTERY_CONTRACT] as any,
      },
      {
        address: TOKEN_CONTRACT as `0x${string}`,
        abi: TOKEN.abi as any,
        functionName: "balanceOf",
        args: [address] as any,
      },
      {
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi as any,
        functionName: "betPrice",
      },
    ],
  });

  const { isLoading: isLoadingWrite, writeAsync } = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "bet",
  });

  const onPlaceBets = async () => {
    try {
      const { hash } = await writeAsync();
      const explorer = chain?.blockExplorers?.default.url;

      console.log(`${explorer}/tx/${hash}`);
    } catch (err) {
      console.log(err);
    }
  };

  const onApproved = async () => {
    console.log("Aproving...");
    setApproved(true);
  };

  useEffect(() => {
    if (isDisconnected) return;
    const [allowance, tokenBalance, betPrice] = data as any;
    if (tokenBalance.status === "success") {
      setDisabled(tokenBalance.result < betPrice.result);
    }

    if (allowance.status === "success") {
      setApproved(allowance.result >= betPrice.result);
    }
  }, [isDisconnected, data]);

  useEffect(() => {
    if (isLoadingRead) return;
    if (!approved) return setText("Approve");
    setText("Place Bets");
  }, [isLoadingRead, approved]);

  return (
    <div className={styles.container}>
      <button
        disabled={isLoadingWrite || isDisconnected || isLoadingRead || disabled}
        onClick={approved ? onPlaceBets : onApproved}
      >
        {text}
      </button>
    </div>
  );
}
