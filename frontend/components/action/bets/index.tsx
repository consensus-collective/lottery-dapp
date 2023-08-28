import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useBet } from "@/hooks/use-bet.hook";

import styles from "./bets.module.css";

export default function PlaceBets() {
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [times, setTimes] = useState<string>("1");
  const [maxTimes, setMaxTimes] = useState<string>("1");
  const [text, setText] = useState<string>("Place Bets");

  const { address, isDisconnected, isConnecting } = useAccount();
  const { bet, betMany, betFee, betPrice, approve, checkAllowance } =
    useBet(address);

  const { writeAsync: writeBet } = bet;
  const { writeAsync: writeBetMany } = betMany;
  const { writeAsync: writeApprove } = approve;

  useEffect(() => {
    if (isDisconnected || isConnecting) {
      return setText("Place Bets");
    }

    if (loading) {
      if (!approved) {
        setText("Approving...");
      } else {
        setText("Betting...");
      }
    } else {
      if (approved || isDisconnected) {
        setText("Place Bets");
      } else {
        setText("Approve");
      }
    }
  }, [isDisconnected, approved, loading, isConnecting]);

  useEffect(() => {
    if (isDisconnected || !address) return;
    onCheckAllowance();
  }, [isDisconnected, betPrice, address, betFee]);

  const onCheckAllowance = async () => {
    await checkAllowance((allowance, totalBet) => {
      setApproved(allowance >= totalBet);

      if (allowance >= totalBet) {
        const maxTimes = allowance / totalBet;
        setTimes("1");
        setMaxTimes(maxTimes.toString());
      }
    });
  };

  const onPlaceBets = async () => {
    const betTimes = Number(times);
    if (betTimes <= 0) return;

    setLoading(true);

    try {
      if (betTimes > 1) {
        await writeBetMany({ args: [times] });
      } else {
        await writeBet();
      }

      await onCheckAllowance();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onApproved = async () => {
    setLoading(true);

    try {
      await writeApprove();
      await onCheckAllowance();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onChangeTimes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value, maxTimes);
    if (!amount) {
      return;
    }

    setTimes(amount);
  };

  return (
    <div className={styles.container}>
      {approved && (
        <React.Fragment>
          <p>Total bets: </p>
          <input
            value={times}
            onChange={onChangeTimes}
            disabled={loading || isConnecting}
          />
          <p style={{ marginBottom: "20px" }}>Max bets: {maxTimes} times</p>
        </React.Fragment>
      )}

      <button
        disabled={loading || isDisconnected || +times <= 0 || isConnecting}
        onClick={approved ? onPlaceBets : onApproved}
      >
        {text}
      </button>
    </div>
  );
}

function validateNumber(value: string, maxTimes: string): string {
  const regex = new RegExp(/^\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const num = Number(value);
  if (num > +maxTimes) {
    return "";
  }

  if (num > 999) {
    return "";
  }

  return num.toString();
}
