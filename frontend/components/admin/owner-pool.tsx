import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";

import styles from "./admin.module.css";

interface Props {
  pool: bigint;
  loading: boolean;
  onWithdraw: (amount: bigint, cb?: () => void) => Promise<void>;
}

export function OwnerPool(props: Props) {
  const { pool, onWithdraw, loading } = props;

  const [ownerPool, setOwnerPool] = useState<bigint>(BigInt(0));
  const [amount, setAmount] = useState<string>("0");
  const [amountBN, setAmountBN] = useState<bigint>(BigInt(0));

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) return;
    const amountBN = parseEther(amount as `${number}`);
    if (amountBN > pool) {
      return;
    }

    setAmount(amount);
    setAmountBN(amountBN);
  };

  const onWithdrawToken = async () => {
    await onWithdraw(amountBN, () => {
      setAmountBN(BigInt(0));
      setAmount("0");
      setOwnerPool((pool) => pool - amountBN);
    });
  };

  useEffect(() => {
    setOwnerPool(pool);
  }, [pool]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Owner pool</p>
      <p>Token Amount: {formatEther(ownerPool)}</p>
      <input value={amount} onChange={onChange} disabled={loading} />
      <button disabled={loading || ownerPool <= 0} onClick={onWithdrawToken}>
        {loading ? "Withdrawing..." : "Withdraw"}
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
