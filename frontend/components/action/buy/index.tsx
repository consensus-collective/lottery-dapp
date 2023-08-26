import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { parseEther } from "viem";
import { waitForTransaction, writeContract } from "@wagmi/core";

import styles from "./buy.module.css";

import LOTTERY from "@/artifacts/lottery.json";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

interface BuyTokenProps {
  onChangeMessage: (message: string, status: string, url?: string) => void;
}

export function BuyToken(props: BuyTokenProps) {
  const { onChangeMessage } = props;

  const [amount, setAmount] = useState<`${number}`>("0");
  const [loading, setLoading] = useState<boolean>(false);

  const { chain } = useNetwork();
  const { isDisconnected } = useAccount();

  const onBuyToken = async () => {
    setLoading(true);

    const amountBN = parseEther(amount);

    try {
      const { hash } = await writeContract({
        address: LOTTERY_CONTRACT as `0x${string}`,
        abi: LOTTERY.abi,
        functionName: "purchaseTokens",
        value: amountBN as any,
      });

      const { transactionHash } = await waitForTransaction({ hash });

      const explorer = chain?.blockExplorers?.default.url;
      const message = transactionHash;
      const status = "success";
      const url = explorer ? `${explorer}/tx/${transactionHash}` : "";

      onChangeMessage(message, status, url);
      setAmount("0");
    } catch (err) {
      onChangeMessage((err as any).message, "error");
    } finally {
      setLoading(false);
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
      <p>ETH Amount:</p>
      <input value={amount} onChange={onChangeAmount} />
      <button disabled={loading || isDisconnected} onClick={onBuyToken}>
        {loading ? "Buying..." : "Buy Token"}
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
