import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { formatEther, parseEther } from "viem";

import styles from "./admin.module.css";

interface Props {
  balance: bigint;
  ratio: bigint;
  allowance: bigint;
  loading: boolean;
  onApprove: (amount: bigint) => Promise<void>;
  onReturn: (amount: bigint, cb?: () => void) => Promise<void>;
}

export function AdminBalance(props: Props) {
  const { balance, onReturn, loading, ratio, allowance, onApprove } = props;

  const [approved, setApproved] = useState<boolean>(false);
  const [text, setText] = useState<string>("Return Token");
  const [amount, setAmount] = useState<string>("0");
  const [amountBN, setAmountBN] = useState<bigint>(BigInt(0));

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (loading) {
      if (!approved) {
        setText("Approving...");
      } else {
        setText("Returning...");
      }
    } else {
      if (approved) {
        setText("Return Token");
      } else {
        setText("Approve");
      }
    }
  }, [approved, loading]);

  useEffect(() => {
    setApproved(allowance >= amountBN);
  }, [amountBN, allowance]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) return;
    const amountBN = parseEther(amount as `${number}`);
    if (amountBN > balance) {
      return;
    }

    setAmount(amount);
    setAmountBN(amountBN);
  };

  const onWithdrawToken = async () => {
    await onReturn(amountBN, () => {
      setAmountBN(BigInt(0));
      setAmount("0");
    });
  };

  const onMouseLeave = () => {
    if (ratio <= 0) return;
    if (amountBN <= 0) return;
    enqueueSnackbar({
      variant: "info",
      message: `You will receive ${formatEther(amountBN / ratio)} ETH`,
    });
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Admin balance</p>
      <p>Token Amount: {formatEther(balance)}</p>
      <input
        value={amount}
        onChange={onChange}
        disabled={loading}
        onMouseLeave={onMouseLeave}
      />
      <button
        disabled={loading || balance <= 0}
        onClick={approved ? onWithdrawToken : () => onApprove(amountBN)}
      >
        {text}
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
