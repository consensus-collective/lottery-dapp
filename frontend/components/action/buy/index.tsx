import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";

import styles from "./buy.module.css";

export function BuyToken() {
  const [ethAmountBN, setEthAmountBN] = useState<bigint>(BigInt(0));
  const [amount, setAmount] = useState<`${number}`>("0");
  const [ethAmount, setEthAmount] = useState<string>("0");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { address, isDisconnected, isConnecting } = useAccount();
  const { purchaseTokens, purchaseRatio } = useLottery();
  const { data } = useBalance({ address });
  const { writeAsync } = purchaseTokens;

  useEffect(() => {
    setDisabled(isConnecting);
  }, [isConnecting]);

  const onBuyToken = async () => {
    setLoading(true);

    try {
      await writeAsync({ value: ethAmountBN });

      setAmount("0");
      setEthAmountBN(BigInt(0));
      setEthAmount("0");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    const value = event.target.value;
    const tokenAmount = validateNumber(value);
    if (!tokenAmount) {
      return;
    }

    const tokenAmountBN = parseEther(tokenAmount as `${number}`);
    const ethAmountBN = tokenAmountBN / purchaseRatio;
    if (ethAmountBN > data.value) {
      return;
    }

    setEthAmountBN(ethAmountBN);
    setEthAmount(formatEther(ethAmountBN));
    setAmount(tokenAmount as `${number}`);
  };

  return (
    <div className={styles.container}>
      <p>Token amount:</p>
      <input
        value={amount}
        onChange={onChangeAmount}
        disabled={loading || isDisconnected || disabled}
      />
      <p style={{ marginBottom: "20px" }}>Price: {ethAmount} ETH</p>
      <button
        disabled={loading || isDisconnected || disabled}
        onClick={onBuyToken}
      >
        {loading ? "Purchasing..." : `Purchase Token`}
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
  if (values.length === 1) {
    return Number(values[0]).toString();
  }

  if (values[1] && values[1].length > 5) {
    return "";
  }

  return values.join(".");
}
