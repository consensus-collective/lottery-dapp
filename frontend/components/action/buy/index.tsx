import { useState } from "react";
import { useContractWrite } from "wagmi";
import { parseEther } from "viem";

import styles from "./buy.module.css";

export default function BuyToken() {
  const [amount, setAmount] = useState<`${number}`>("0")

  const { isLoading } = useContractWrite({});

  const onBuyToken = () => {
    const amountBN = parseEther(amount)
    console.log(amountBN);
    console.log("Buy");

    setAmount("0")
  };

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value)
    if (!amount) {
      return
    }

    setAmount(amount as `${number}`)
  }

  return (
    <div className={styles.container}>
      <input value={amount} onChange={onChangeAmount}/>
      <button disabled={isLoading} onClick={onBuyToken}>
        Buy Tokens
      </button>
    </div>
  );
}

function validateNumber(value: string): string {
  const regex = new RegExp(/^\d*\.?\d*$/)
  if (!regex.exec(value)) {
    return ""
  }

  const values = value.split(".");
  if (values.length > 2) {
    return ""
  }

  values[0] = Number(values[0]).toString();
  if (values[0].length > 3) {
    return ""
  }

  if (values.length === 1) {
    return values[0]
  }

  if (values[1] && values[1].length > 5) {
    return ""
  }

  return values.join(".")
}
