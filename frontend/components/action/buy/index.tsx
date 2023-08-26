import { useState } from "react";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { parseEther } from "viem";

import styles from "./buy.module.css";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

export default function BuyToken() {
  const [amount, setAmount] = useState<`${number}`>("0");

  const { chain } = useNetwork();
  const { isDisconnected } = useAccount();
  const { isLoading, writeAsync } = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "purchaseTokens",
  });

  const onBuyToken = async () => {
    const amountBN = parseEther(amount);

    try {
      const { hash } = await writeAsync({
        value: amountBN,
      });

      const explorer = chain?.blockExplorers?.default.url;

      console.log(`${explorer}/tx/${hash}`);
    } catch (err) {
      console.log(err);
    } finally {
      setAmount("0");
    }
  };

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) {
      return;
    }

    setAmount(amount as `${number}`);
  };

  return (
    <div className={styles.container}>
      <input value={amount} onChange={onChangeAmount} />
      <button disabled={isLoading || isDisconnected} onClick={onBuyToken}>
        Buy Tokens
      </button>
    </div>
  );
}

function validateNumber(value: string): string {
  const regex = new RegExp(/^\d*\.?\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const values = value.split(".");
  if (values.length > 2) {
    return "";
  }

  values[0] = Number(values[0]).toString();
  if (values[0].length > 3) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values[1] && values[1].length > 5) {
    return "";
  }

  return values.join(".");
}
