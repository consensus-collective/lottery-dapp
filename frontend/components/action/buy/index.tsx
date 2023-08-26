import { useState } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";

import styles from "./buy.module.css";

export function BuyToken() {
  const [amount, setAmount] = useState<`${number}`>("0");
  const [loading, setLoading] = useState<boolean>(false);

  const { isDisconnected } = useAccount();
  const { purchaseTokens } = useLottery();

  const { writeAsync } = purchaseTokens;

  const onBuyToken = async () => {
    setLoading(true);

    try {
      const amountBN = parseEther(amount);

      await writeAsync({ value: amountBN });

      setAmount("0");
    } catch {
      // ignore
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
